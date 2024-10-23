from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__, template_folder=os.getcwd(), static_folder='assets')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/submit_form', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        persons = request.form['persons']
        reservation_date = request.form['reservation-date']
        reservation_time = request.form['reservation-time']
        message = request.form['message']
        
           # Check for empty fields on the server side
        if not name or not phone or not persons:
            return jsonify({"status": "emptyField"})


        # Store data in the database
        store_data(name, phone, persons, reservation_date, reservation_time, message)

        return jsonify({"status": "success"})

    return jsonify({"status": "error", "message": "Invalid request method"})
def store_data(name, phone, persons, reservation_date, reservation_time, message):
   
    # Connect to the SQLite database (you can use other databases too)
    conn = sqlite3.connect('reservation_data.db')
    cursor = conn.cursor()

    # Create a table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            persons INTEGER,
            reservation_date TEXT,
            reservation_time TEXT,
            message TEXT
        )
    ''')

    # Insert data into the table
    cursor.execute('''
        INSERT INTO reservations (name, phone, persons, reservation_date, reservation_time, message)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, phone, persons, reservation_date, reservation_time, message))

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()



#Handle the email form
@app.route('/submit_formEmail', methods=['POST'])
def submit_form_email():
    if request.method == 'POST':
        email_address = request.form['email_address']

        # Check if the email address is provided
        if not email_address:
            return jsonify({"status": "emptyField"})

        # Store the email address in the database
        store_email(email_address)

        return jsonify({"status": "success"})

    return jsonify({"status": "error", "message": "Invalid request method"})

# Function to store email address in SQLite database
def store_email(email_address):
    # Connect to the SQLite database
    conn = sqlite3.connect('subscription_data.db')
    cursor = conn.cursor()

    # Create a table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_address TEXT
        )
    ''')

    # Insert the email address into the table
    cursor.execute('''
        INSERT INTO subscriptions (email_address)
        VALUES (?)
    ''', (email_address,))

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()



if __name__ == '__main__':
    app.run(debug=True)
