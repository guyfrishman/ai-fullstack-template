from fastapi import APIRouter

router = APIRouter()


@router.get("/ping", summary="Liveness check")
async def ping():
    return {"status": "ok"}
