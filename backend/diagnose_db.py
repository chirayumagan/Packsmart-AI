"""
diagnose_db.py — Test MySQL connectivity with multiple auth strategies.
Run from backend/ with: .\venv\Scripts\python.exe diagnose_db.py
"""
import sys
import pymysql

HOST = "127.0.0.1"
PORT = 3306
USER = "root"
PASSWORD = "admin123"

strategies = [
    {"desc": "Standard (caching_sha2_password)", "kwargs": {}},
    {"desc": "ssl_disabled=True", "kwargs": {"ssl_disabled": True}},
    {"desc": "SSL with no verification", "kwargs": {"ssl": {"ssl": {}}}},
    {"desc": "mysql_native_password plugin", "kwargs": {"auth_plugin_map": {"caching_sha2_password": None}}},
]

print(f"[diag] Trying to connect as {USER}@{HOST}:{PORT}")
print(f"[diag] Password length: {len(PASSWORD)} chars\n")

connected = False
for s in strategies:
    try:
        conn = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASSWORD, **s["kwargs"])
        print(f"[diag] ✅ SUCCESS with strategy: {s['desc']}")
        cur = conn.cursor()
        cur.execute("SELECT user, host, plugin FROM mysql.user WHERE user='root';")
        rows = cur.fetchall()
        for row in rows:
            print(f"       user={row[0]}, host={row[1]}, plugin={row[2]}")
        conn.close()
        connected = True
        break
    except Exception as e:
        print(f"[diag] ❌ FAILED ({s['desc']}): {e}")

if not connected:
    print("\n[diag] All strategies failed.")
    print("[diag] Possible causes:")
    print("  1. Password is incorrect — please verify in MySQL Workbench")
    print("  2. Root user is locked or has expired password")
    print("  3. MySQL is not listening on 127.0.0.1:3306")
    sys.exit(1)
