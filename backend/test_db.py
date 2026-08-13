from app.database import engine

try:
    with engine.connect() as connection:
        print("✅ PostgreSQL connected successfully!")
except Exception as e:
    print("❌ Connection failed:")
    print(e)