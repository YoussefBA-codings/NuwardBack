# NuwardBack

Nuward tests

Users

CRUD

getUser
curl --location --request GET '51.75.142.58:8081/users'

addUser
gestion d’erreur
WEAK PASSWORD
curl --location --request POST '51.75.142.58:8081/users/add' \
--header 'Content-Type: application/json' \
--data-raw '{
"pseudo" : "Youssef",
"firstname" : "Youssef",
"lastname" : "Ben Amor",
"email" : "test@gmail.com",
"password" : "1234"
}'


deleteUser
curl --location --request GET '51.75.142.58:8081/users/delete/12'

updateUser
curl --location --request PUT '51.75.142.58:8081/users/update/11' \
--header 'Content-Type: application/json' \
--data-raw '{ 
"lastname" : "Ben Amor"
}'




Requêtes spéciales
getUserById
curl --location --request GET '51.75.142.58:8081/users/get/11'






















Nuward tests

Projects

CRUD

getProjects
curl --location --request GET '51.75.142.58:8081/projects'

addProject
curl --location --request POST '51.75.142.58:8081/projects/add' \
--header 'Content-Type: application/json' \
--data-raw '{
"name" : "testing",
"length" : 100,
"width" : 100,
"graduation_unit" : 10
}'


deleteProject

curl --location --request GET '51.75.142.58:8081/projects/delete/6'


updateProject

curl --location --request PUT '51.75.142.58:8081/projects/update/5' \
--header 'Content-Type: application/json' \
--data-raw '{
"name" : "yes"
}'


Requêtes spéciales


getProjectById

curl --location --request GET '51.75.142.58:8081/projects/1'


















Nuward tests

Drawings

CRUD

getDrawings
curl --location --request GET '51.75.142.58:8081/drawings'

addDrawing

curl --location --request POST '51.75.142.58:8081/drawings/add' \
--header 'Content-Type: application/json' \
--data-raw '{
"idProjectUser" : 99,
"feature" : {
"test" : "test"
}
}'

deleteDrawing
curl --location --request GET '51.75.142.58:8081/drawings/delete/2'

updateDrawings

curl --location --request PUT '51.75.142.58:8081/drawings/update/2' \
--header 'Content-Type: application/json' \
--data-raw '{
"idProjectUser" : 99,
"feature" : {
"test" : "test123"
}
}'






























Nuward tests

Requêtes spéciales  



getUsersByProject
curl --location --request GET '51.75.142.58:8081/special/users/project/1'

addUserInProject
curl --location --request POST '51.75.142.58:8081/special/add/user/project/7' \
--header 'Content-Type: application/json' \
--data-raw '{
"idUser" : 2
}'

getProjectsByUser
curl --location --request GET '51.75.142.58:8081/special/projects/user/10' \
--header 'Content-Type: application/json'


getDrawingByUserAndProject

curl --location --request GET '51.75.142.58:8081/special/drawings/projet/1/user/10' \
--header 'Content-Type: application/json'



Algorithme d’attribution de position

curl --location --request POST '51.75.142.58:8081/special/add/user/999/project/3' \
--header 'Content-Type: application/json' \
--data-raw '{
"newBoxLength" : 10
}'
