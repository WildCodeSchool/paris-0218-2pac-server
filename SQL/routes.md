### articles

- recover all articles
GET /articles
-> [ ARTICLES ]

- add new article
POST /articles 
	- title
	- shortDescription
	- description
	- eventDate
	- category
	- image
	- imageDescription
-> OK

UPDATE /articles

DELETE /articles

### documents

- recover all documents
GET /documents
-> [ DOCUMENTS ]

- add new document
POST /documents 
  - type
  - title
  - shortDescription
  - url
  - isMemberOnly
  - isResource
  - isArchived
-> OK

UPDATE /documents

DELETE /documents


### authentication

- sign in with credentials
POST /signin
	- username
	- password 
-> OK

- sign out
GET /signout
-> OK

