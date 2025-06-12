# TodoApp Backend

## Configuration Setup

1. Copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties`
2. Update the following properties in `application.properties`:
   - Database credentials (username and password)
   - JWT secret key
   - Other environment-specific configurations

## Security Note
Never commit the actual `application.properties` file to version control as it contains sensitive information.
Always use the example file as a template and keep your actual configuration local. 