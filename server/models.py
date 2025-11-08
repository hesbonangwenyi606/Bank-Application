from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with Account
    accounts = db.relationship('Account', backref='user', cascade='all, delete-orphan')

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'joined_at': self.joined_at.strftime('%Y-%m-%d %H:%M:%S'),
            'accounts': [account.serialize() for account in self.accounts]
        }

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(50), default='personal')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    balance = db.Column(db.Float, default=100)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationship with Transaction
    transactions = db.relationship('Transaction', backref='account', cascade='all, delete-orphan')

    def serialize(self):
        return {
            'id': self.id,
            'account_name': self.account_name,
            'created_date': self.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'balance': self.balance,
            'transactions': [transaction.serialize() for transaction in self.transactions]
        }

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'description': self.description,
            'amount': self.amount,
            'transaction_date': self.transaction_date.strftime('%Y-%m-%d %H:%M:%S')
        }

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship('User', backref='admin', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'joined_at': self.joined_at.strftime('%Y-%m-%d %H:%M:%S')
        }
