from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False)
    shortlist = relationship("Shortlist", back_populates="user")
    tasks = relationship("Task", back_populates="user")
    messages = relationship("ChatMessage", back_populates="user")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # user or bot
    text = Column(Text)
    is_action = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="messages")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Personal Info
    full_name = Column(String)
    
    # Onboarding Data
    current_education_level = Column(String)  # High School, Undergrad, etc.
    degree_major = Column(String)
    graduation_year = Column(Integer)
    gpa = Column(Float, nullable=True) # or String if percentage
    
    target_degree = Column(String) # Masters, Bachelors
    target_field = Column(String)
    target_intake_year = Column(Integer)
    preferred_countries = Column(JSON) # List of strings
    
    budget_range = Column(String)
    funding_plan = Column(String) # Self, Loan, Scholarship
    
    # Readiness
    exam_scores = Column(JSON) # {"IELTS": 7.5, "GRE": 310}
    sop_status = Column(String) # Not Started, Draft, Ready
    
    # System State
    onboarding_completed = Column(Boolean, default=False)
    current_stage = Column(String, default="Building Profile") # Discovery, Shortlisting, Applications
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String, index=True)
    location = Column(String)
    
    tuition_fee = Column(String) # Store as string range or number
    acceptance_rate = Column(Float)
    ranking = Column(Integer, nullable=True)
    
    details = Column(JSON) # Extra data from API
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Shortlist(Base):
    __tablename__ = "shortlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    university_id = Column(Integer, ForeignKey("universities.id")) # Can be null if custom uni not in DB yet? No, should be in DB.
    
    category = Column(String) # Dream, Target, Safe
    is_locked = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="shortlist")
    # university = relationship("University") # Optional relationship if needed

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    title = Column(String)
    description = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    is_auto_generated = Column(Boolean, default=False)
    position = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="tasks")
