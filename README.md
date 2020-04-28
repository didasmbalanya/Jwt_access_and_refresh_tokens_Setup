# Setting up jwt with refresh tokens 

This projects sets up 2 separate servers:
1. purerly for auth(login, logout and refresh access token)
2. Serve api data

They share the same secret for signing the tokens which enable a user to access both endpoints with the same token

*Basic setup*