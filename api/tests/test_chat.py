def test_chat_happy_path(client, mock_llm):
    # Create a session.
    init = client.post("/api/v1/chat/init")
    assert init.status_code == 200
    session_id = init.json()["session_id"]
    assert session_id

    # Send a message; the LLM client is mocked, so no network is used.
    response = client.post(
        "/api/v1/chat/send_message",
        json={"user_query": "Hello there", "session_id": session_id},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == "This is a mocked assistant reply."
    assert body["session_id"] == session_id
    assert body["trace_id"]


def test_chat_creates_session_when_missing(client, mock_llm):
    response = client.post(
        "/api/v1/chat/send_message",
        json={"user_query": "No session id provided"},
    )
    assert response.status_code == 200
    assert response.json()["session_id"]


def test_models_lists_provider_models(client, mock_llm):
    response = client.get("/api/v1/models/")
    assert response.status_code == 200
    body = response.json()
    names = [m["name"] for m in body["models"]]
    assert "mock-model-a" in names
    assert body["default_model"]
