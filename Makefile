clean:
	rm -rf build
	mkdir -p build
	touch build/.higit

build-visual-qontract:
	@echo "Building visual-qontract"
	./build.sh @redhatinsights/backstage-plugin-visual-qontract visual-qontract

build-webrca-frontend:
	@echo "Building webrca-frontend"
	./build.sh @redhatinsights/backstage-plugin-webrca-frontend webrca-frontend

build-webrca-backend:
	@echo "Building webrca-backend"
	./build.sh @redhatinsights/backstage-plugin-webrca-backend webrca-backend

build-all: clean build-visual-qontract build-webrca-frontend build-webrca-backend
