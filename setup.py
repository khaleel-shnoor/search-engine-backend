import os

frontend_structure = {
    "frontend": {
        "public": {},
        "src": {
            "components": {
                "files": [
                    "SearchBar.js",
                    "ResultsList.js",
                    "ResultItem.js",
                    "Pagination.js",
                    "Loader.js",
                    "Suggestions.js"
                ]
            },
            "pages": {
                "files": [
                    "Home.js"
                ]
            },
            "services": {
                "files": [
                    "api.js"
                ]
            },
            "files": [
                "App.js",
                "index.js"
            ]
        }
    }
}

def create_structure(base_path, structure):
    for key, value in structure.items():
        current_path = os.path.join(base_path, key)

        if key == "files":
            for file in value:
                file_path = os.path.join(base_path, file)
                with open(file_path, "w") as f:
                    pass
        else:
            os.makedirs(current_path, exist_ok=True)
            if isinstance(value, dict):
                create_structure(current_path, value)

def setup_frontend():
    create_structure(".", frontend_structure)
    print("✅ Frontend structure created correctly!")

if __name__ == "__main__":
    setup_frontend()