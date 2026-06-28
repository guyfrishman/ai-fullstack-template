def test_api_open_when_key_unset(client, mock_llm, monkeypatch):
    # With no API_ACCESS_KEY set, protected routes are open.
    monkeypatch.delenv("API_ACCESS_KEY", raising=False)
    response = client.post("/api/v1/chat/init")
    assert response.status_code == 200


def test_auth_required_when_key_set(client, monkeypatch):
    monkeypatch.setenv("API_ACCESS_KEY", "secret-key")

    # Missing header -> rejected.
    missing = client.post("/api/v1/chat/init")
    assert missing.status_code == 403

    # Wrong header -> rejected.
    wrong = client.post("/api/v1/chat/init", headers={"X-API-Key": "nope"})
    assert wrong.status_code == 403

    # Correct header -> allowed.
    ok = client.post("/api/v1/chat/init", headers={"X-API-Key": "secret-key"})
    assert ok.status_code == 200
