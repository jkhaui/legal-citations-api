# Legal Citations API

## Demonstration Purposes Only

GraphQL Playground live demo: https://hgibqzetag.execute-api.ap-southeast-2.amazonaws.com/dev/

![demo](https://misc-4.s3-ap-southeast-1.amazonaws.com/gql.gif)

This is an API built to return the raw metadata of various legal sources (e.g
. books, cases, treaties) automatically formatted in AGLC4 format: https://law.unimelb.edu.au/__data/assets/pdf_file/0005/3181325/AGLC4-with-Bookmarks-1.pdf

### Stack used:
- Serverless framework (deployed to AWS Lambda)
- MySQL instance on AWS RDS
- GraphQL

### Challenges faced:

Node.js, SQL, GraphQL and serverless are a slightly unorthodox combo, so it took some
help from various libraries (e.g. https://github.com/jeremydaly/serverless-mysql) to get this
playing nicely. But once it worked, it proved to be an amazing approach to building a low-cost,
low maintenance but highly performant API driven by client queries.

Note that this repo is only meant to show the code and tech stack used. It
 won't work locally as the API keys and database instance connected to this
  API have been omitted. However, you can use the live demo. Some example
   queries to try (**copy and paste the query into GraphQL playground provided
    by the link at the top)**:

```
query {
  books(title: "platform revolution") {
    title
    authors_footnote
    authors_bibliography
    publication_details
  }
  cases(case_name: "bondelmonte") {
    case_name
    citation
  }
  treaties(treaty_title: "singapore") {
    treaty_title
    short_title
    treaty_title
    party_names
    date_of_entry_into_force
    date_opened_for_signature
  }
}
```

```
query {
   books(title: "legal reform", max_results: 4) {
     title
     publication_details
     authors_footnote
     authors_bibliography
   }
 }
 ```
 
 Note how efficient it is to only query the exact fields we're
 after - much more flexible than REST APIs!
 
