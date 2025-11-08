from flask import Flask, request, jsonify
from models import db, User, Account, Transaction, Admin
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

# Route to get all users
@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    user_list = [{'id': user.id, 'username': user.username, 'first_name': user.first_name ,'last_name': user.last_name ,'email':user.email} for user in users]
    return jsonify({'users': user_list})

# Route to get all admins
@app.route('/admins', methods=['GET'])
def get_all_admins():
    admins = Admin.query.all()
    admin_list = [{'id': admin.id, 'username': admin.username, 'first_name': admin.first_name ,'last_name': admin.last_name ,'email':admin.email} for admin in admins]
    return jsonify({'admins': admin_list})

# Route to get user by ID
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email
        }
        return jsonify({'user': user_data}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Route to get admin by ID
@app.route('/admin/<int:admin_id>', methods=['GET'])
def get_admin_by_id(admin_id):
    admin = Admin.query.get(admin_id)
    if admin:
        admin_data = {
            'id': admin.id,
            'first_name': admin.first_name,
            'last_name': admin.last_name,
            'username': admin.username,
            'email': admin.email
        }
        return jsonify(admin_data), 200
    else:
        return jsonify({'message': 'Admin not found'}), 404

# Route to update user username
@app.route('/update_username/<int:user_id>', methods=['PUT'])
def update_username(user_id):
    user = User.query.get(user_id)

    if user:
        new_username = request.json.get('new_username')

        if new_username:
            user.username = new_username
            db.session.commit()
            return jsonify({'message': 'Username updated successfully'}), 200
        else:
            return jsonify({'error': 'New username is missing or empty'}), 400
    else:
        return jsonify({'error': 'User not found'}), 404

# Route to delete a user's transaction
@app.route('/delete_transaction/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)

    if transaction:
        user = User.query.filter_by(id=transaction.account.user_id).first()

        db.session.delete(transaction)
        db.session.commit()

        return jsonify({'message': 'Transaction deleted successfully'}), 200
    else:
        return jsonify({'error': 'Transaction not found'}), 404

# Route to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json

        # Check if all required fields are present
        required_fields = ['username', 'password', 'first_name', 'last_name', 'email']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            raise BadRequest(description=f'Missing required fields: {", ".join(missing_fields)}')

        username = data['username']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']

        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists'}), 400

        new_user = User(username=username, password=generate_password_hash(password), first_name=first_name, last_name=last_name, email=email)
        db.session.add(new_user)
        db.session.commit()

        # Create a new account with the default name 'personal'
        new_account = Account(user_id=new_user.id)
        db.session.add(new_account)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    

 # route to delete user

@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)

        if user is None:
            raise ValueError(f"User with ID {user_id} not found.")
        

        # Delete associated accounts
        for account in user.accounts:
            db.session.delete(account)

        
        
        # Delete associated transactions
        for transaction in account.transactions:
            db.session.delete(transaction)


        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': f'User with ID {user_id} deleted successfully'}), 200

    except IntegrityError as e:
        db.session.rollback()  
        return jsonify({'error': 'IntegrityError', 'details': str(e)}), 400

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    except Exception as e:
        db.session.rollback()  
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    

# admin signup
@app.route('/admin/signup', methods=['POST'])
def register_admin():
    data = request.json
    username = data['username']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']

    if Admin.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    new_admin = Admin(username=username, password=generate_password_hash(password), first_name=first_name, last_name=last_name, email=email)
    db.session.add(new_admin)
    db.session.commit()

   

    return jsonify({'message': 'Admin registered successfully'}), 201


# Route to login a user
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email
        }
        return jsonify({'user': user_data, 'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

    
# Route to login an admin

@app.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.json
    username = data['username']
    password = data['password']

    admin = Admin.query.filter_by(username=username).first()

    if admin and check_password_hash(admin.password, password): 
        return jsonify({'message': 'Admin login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401 

# route to get user accounts
@app.route('/user/<int:user_id>/accounts', methods=['GET'])
def get_user_accounts(user_id):
    user = User.query.get_or_404(user_id)

    accounts_data = []
    for account in user.accounts:
        account_data = {
            'id': account.id,
            'created_date': account.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'balance': account.balance,
            'name': account.account_name,  
            'transactions': [
                {
                    'id': transaction.id,
                    'amount': transaction.amount,
                    'transaction_date': transaction.transaction_date.strftime('%Y-%m-%d %H:%M:%S')
                }
                for transaction in account.transactions
            ]
        }
        accounts_data.append(account_data)

    return jsonify({'accounts': accounts_data}), 200
    
# route to edit account name

@app.route('/user/<int:user_id>/accounts/<int:account_id>', methods=['PATCH'])
def edit_account_name(user_id, account_id):
    try:
        # Get the user and account
        user = User.query.get_or_404(user_id)
        account = Account.query.get_or_404(account_id)

        # Extract the new account name from the request JSON
        new_account_name = request.json.get('new_account_name')

        # Update the account name
        account.account_name = new_account_name
        db.session.commit()

        return jsonify({'message': 'Account name updated successfully'}), 200
    except Exception as e:
        print(f"Error during account name update: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    
# route to fetch user account transactions
@app.route('/user/<int:user_id>/accounts/<int:account_id>/transactions', methods=['GET'])
def get_account_transactions(user_id, account_id):
    try:
        # Check if the user and account exist
        user = User.query.get_or_404(user_id)
        account = Account.query.get_or_404(account_id)

        # Ensure that the account belongs to the user
        if account.user_id != user.id:
            return jsonify({'error': 'Unauthorized access to account transactions'}), 403

        transactions_data = []
        for transaction in account.transactions:
            transaction_data = {
                'id': transaction.id,
                'amount': transaction.amount,
                'description': transaction.description,
                'transaction_date': transaction.transaction_date.strftime('%Y-%m-%d %H:%M:%S')
            }
            transactions_data.append(transaction_data)

        return jsonify({'transactions': transactions_data}), 200

    except Exception as e:
        print(f"Error fetching transactions: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# route to add transactions
@app.route('/<int:account_id>/transactions', methods=['POST'])
def add_transaction(account_id):
    try:
        data = request.json

        # Check if all required fields are present
        required_fields = ['amount', 'description']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            raise BadRequest(description=f'Missing required fields: {", ".join(missing_fields)}')

        amount = data['amount']
        description = data['description']

        # Check if the account exists
        account = Account.query.get_or_404(account_id)

        # Create a new transaction
        new_transaction = Transaction(amount=amount, description=description, account_id=account_id)

        # Update the account balance based on the transaction amount
        account.balance += amount

        # Commit changes to the database
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({'message': 'Transaction added successfully', 'account_balance': account.balance}), 201

    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except IntegrityError as e:
        # Handle any integrity errors, such as duplicate key violations
        db.session.rollback()
        return jsonify({'error': 'Integrity Error', 'details': str(e)}), 400
    except Exception as e:
        print(f"Error adding transaction: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

    # route to create new account
@app.route('/user/<int:user_id>/accounts', methods=['POST'])
def create_account(user_id):
    try:
        data = request.json

       
        account_name = data.get('accountName')

        if not account_name:
            raise ValueError("Account Name is required.")

        # Create a new account instance
        new_account = Account(
            user_id=user_id,
            account_name=account_name,
           
        )

        
        db.session.add(new_account)
        db.session.commit()

       
        return jsonify({'message': 'Account created successfully', 'account': {
            'id': new_account.id,
            'user_id': new_account.user_id,
            'account_name': new_account.account_name,
            'created_date': new_account.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'balance': new_account.balance,
           
        }}), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    

# route to delete account
@app.route('/accounts/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    try:
        # Find the account in the database
        account = Account.query.filter_by(id=account_id).first()

        if account is None:
            raise ValueError(f"Account with ID {account_id} not found for user.")

        # Delete associated transactions first
        Transaction.query.filter_by(account_id=account.id).delete()

        # Remove the account from the database
        db.session.delete(account)
        db.session.commit()

        return jsonify({'message': f'Account with ID {account_id} deleted successfully'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# route to get all users and accounts 
@app.route('/admin/users-with-accounts', methods=['GET'])
def get_users_with_accounts():
    try:
        # Assume you have an authentication mechanism to check if the requester is an admin

        # Get all users
        users = User.query.all()

        # Create a list to store user data with accounts
        users_with_accounts = []

        # Loop through each user
        for user in users:
            user_data = {
                'id': user.id,
                'first_name':user.first_name,
                'last_name':user.last_name,
                'username': user.username,
                'email': user.email,
                'accounts': []  # List to store account data for this user
            }

            # Get all accounts for the current user
            accounts = Account.query.filter_by(user_id=user.id).all()

            # Loop through each account and add its data to the user_data
            for account in accounts:
                account_data = {
                    'id': account.id,
                    'account_name': account.account_name,
                    'balance': account.balance
                }

                user_data['accounts'].append(account_data)

            users_with_accounts.append(user_data)

        return jsonify(users_with_accounts), 200

    except Exception as e:
        print(f"Error getting users with accounts: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
