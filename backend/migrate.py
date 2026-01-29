from sqlalchemy import text
from models.database import engine
from models.models import Base

def migrate():
    print("Running manual migrations...")
    with engine.connect() as conn:
        # Add position to tasks if not exists
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN position INTEGER DEFAULT 0;"))
            conn.commit()
            print("- Added 'position' column to 'tasks' table.")
        except Exception as e:
            if "already exists" in str(e):
                print("- 'position' column already exists in 'tasks' table.")
            else:
                print(f"- Warning adding 'position' to 'tasks': {e}")

        # Sync all tables
        Base.metadata.create_all(bind=engine)
        print("- Syncing all tables (create_all)...")
        
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
