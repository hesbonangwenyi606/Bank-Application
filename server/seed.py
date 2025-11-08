from models import db, User, Account, Transaction, Admin
from app import app
from datetime import datetime

def seed_users():
    users_data = [
        {"first_name": "John", "last_name": "Doe", "username": "john_doe", "password": "password123", "email": "john@example.com"},
        {"first_name": "Alice", "last_name": "Smith", "username": "alice_smith", "password": "pass123", "email": "alice@example.com"},
       
    ]

    for user_data in users_data:
        existing_user = User.query.filter_by(username=user_data["username"]).first()
        if not existing_user:
            user = User(**user_data)
            db.session.add(user)
            db.session.commit()

def seed_accounts():
    users = User.query.all()

    for user in users:
        account = Account(user_id=user.id)
        db.session.add(account)
        db.session.commit()

def seed_transactions():
    users = User.query.all()
    
    for user in users:
        account = user.account
        if account:
            transactions_data = [
                {"account_id": account.id, "description": "Deposit", "amount": 100.0, "created_at": datetime.utcnow()},
                # Add more transaction data as needed
            ]

            for transaction_data in transactions_data:
                transaction = Transaction(**transaction_data)
                db.session.add(transaction)
                db.session.commit()

def seed_admins():
    admins_data = [
        {"first_name": "Admin", "last_name": "One", "username": "admin1", "email": "admin@example.com", "password": "adminpass"},
        
    ]

    for admin_data in admins_data:
        admin = Admin(**admin_data)
        
        admin.user = User.query.filter_by(username=admin_data['username']).first()
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_users()
        seed_accounts()
        seed_transactions()
        seed_admins()

    print("Seed data added successfully.")
