from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str
    college: str
    skills: str | None = None

class StudentResponse(BaseModel):
    id: int
    name: str
    college: str
    skills: str | None = None

    class Config:
        from_attributes = True
        