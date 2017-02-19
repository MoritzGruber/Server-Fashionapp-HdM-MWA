curl \
  -F "id=58a96f45253d7a000fbac123" \
  -F "product=someProductId" \
  -F "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYnNvbnR5cGUiOiJPYmplY3RJRCIsImlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbODgsMTY5LDExMSw2OSwzNyw2MSwxMjIsMCwxNSwxODYsMTkzLDM1XX0sImlhdCI6MTQ4NzUwNzM4NCwiZXhwIjoxNDg4MTEyMTg0fQ.x1DlXpAtvk159nn2mVzpORSW4R-CxUgGufiKf3FOK78" \
  -F "content=@1.jpg; type=image/jpg" \
  -X POST 192.168.1.8:8080/api/image/create -i -v
