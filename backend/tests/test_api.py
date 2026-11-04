import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings
from backend.app.core.database import Base, engine

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_menus_list():
    with TestClient(app) as client:
        response = client.get("/api/menus")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "Roti" in data[0]["name"]

def test_checkout_cash_and_status():
    with TestClient(app) as client:
        # 1. Get menu ID
        menus = client.get("/api/menus").json()
        menu_id = menus[0]["id"]

        # 2. Checkout order with flavors
        payload = {
            "guest_name": "Test Budi",
            "guest_wa": "081234567890",
            "payment_method": "CASH",
            "items": [
                {
                    "menu_id": menu_id,
                    "quantity": 1,
                    "flavors": ["Cokelat", "Keju"],
                    "notes": "Roti agak garing ya"
                }
            ]
        }
        res = client.post("/api/orders/checkout", json=payload)
        assert res.status_code == 201
        order = res.json()
        assert order["guest_name"] == "Test Budi"
        assert order["status"] == "PENDING_PAYMENT"
        assert "Cokelat, Keju" in order["items"][0]["selected_flavors"]
        order_id = order["id"]

        # 3. Get order detail
        detail = client.get(f"/api/orders/{order_id}").json()
        assert detail["id"] == order_id
        assert detail["status"] == "PENDING_PAYMENT"

        # 4. Admin update to PROCESSING -> triggers estimated ready time
        update_res = client.put(
            f"/api/orders/{order_id}/status",
            json={"status": "PROCESSING"},
            headers={"X-Admin-Secret": settings.ADMIN_SECRET_KEY}
        )
        assert update_res.status_code == 200
        updated_order = update_res.json()
        assert updated_order["status"] == "PROCESSING"
        assert updated_order["estimated_ready_at"] is not None

        # 5. Admin update to READY -> triggers wa_notify_url
        ready_res = client.put(
            f"/api/orders/{order_id}/status",
            json={"status": "READY"},
            headers={"X-Admin-Secret": settings.ADMIN_SECRET_KEY}
        )
        assert ready_res.status_code == 200
        ready_order = ready_res.json()
        assert ready_order["status"] == "READY"
        assert "wa.me" in ready_order["wa_notify_url"]
