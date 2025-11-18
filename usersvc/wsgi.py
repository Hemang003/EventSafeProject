from app import create_app

app = create_app()

if __name__ == "__main__":
    # Listen on all addresses so Docker can expose it
    app.run(host="0.0.0.0", port=5000)
