import uuid
import requests

BASE_URL = "http://localhost:8080"


def _get(path: str):
    url = BASE_URL.rstrip("/") + path
    return requests.get(url, timeout=10)


def _post(path: str, json: dict):
    url = BASE_URL.rstrip("/") + path
    return requests.post(url, json=json, timeout=10)


def test_health_returns_200_or_204():
    """Health endpoint should return a success-ish status code."""
    res = _get("/health")
    assert res.status_code in (200, 204)


def test_events_list_is_json_list():
    """GET /api/events should return a JSON list (possibly empty)."""
    res = _get("/api/events")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_get_single_event_by_id_if_exists():
    """
    If there is at least one event, we should be able to fetch it again
    via /api/events/<id> and get a JSON object.
    """
    res = _get("/api/events")
    assert res.status_code == 200
    events = res.json()
    assert isinstance(events, list)

    if not events:
        # No events yet – nothing more to assert, but the test still passes.
        return

    first = events[0]
    assert isinstance(first, dict)

    # Try to detect the event id field in a flexible way.
    event_id = first.get("id") or first.get("event_id") or first.get("eventId")
    assert event_id is not None, "Could not find an id/event_id/eventId field in event object"

    res_detail = _get(f"/api/events/{event_id}")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert isinstance(detail, dict)


def test_create_temporary_event_does_not_crash():
    """
    POST /api/events should accept a JSON body and respond with a valid HTTP code.

    Because we don't know the exact schema, we send a generic payload.
    If your API has strict validation, you can adjust the fields below.
    """
    payload = {
        # Change these keys to match your actual API if needed:
        "name": f"CI Test Event {uuid.uuid4()}",
        "location": "CI Test Location",
        "description": "Temporary event created by CI test.",
        "price": 9.99,
        "capacity": 100,
    }

    res = _post("/api/events", json=payload)

    # Ideally this is 201 or 200. If your API returns 400/422 on validation,
    # adjust the set below accordingly.
    assert res.status_code in (200, 201, 400, 422)

    # If created successfully, API should usually return JSON
    # (we don't fail hard if it isn't).
    try:
        _ = res.json()
    except ValueError:
        # Not JSON – acceptable if your API only returns plain text
        pass


def test_get_nonexistent_event_returns_404_or_400():
    """
    GET /api/events/-1 (or some obviously invalid ID)
    should not return 200. Most APIs return 404 or 400.
    """
    res = _get("/api/events/-1")
    assert res.status_code in (400, 404, 422)

