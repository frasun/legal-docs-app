# Integration / Regression Testing

### Documents
1. search docs
2. filter docs
3. create draft and sign-up
4. sign-in
5. edit draft
6. change doc name
7. publish draft
8. export doc to PDF
9. copy document
10. delete document

### Payments
1. anonymous user -> fill out form -> make payment -> create document
   - it should create document with proper url
2. anonymous user -> fill out form -> cancel payment
   - it should return to homepage
3. anonymous user -> fill out form -> sign in -> make payment -> create document
   - it should create user document
4. anonymous user -> fill out form -> sign up -> make payment -> create document
   - it should create user document
5. user -> fill out form -> cancel payment
   - it should create draft user document
6. nonymous user -> fill out form > create draft > sign in
   - it should create user document
7. user -> open draft -> make payment -> create document
   - it should create user document
8. admin -> create document
   - it should skip payment process

### Identities
1. add new identity
2. edit identity
3. remove identity
4. use idientity to create document

---

## Sample data
#### PESEL
- 90090515836
- 92071314764
-  81100216357
-  80072909146
- 90080517455
-  90060804786

#### NIP
- 5222947961
- 5270203603
- 5260028860
- 5223008076
- 1070002973

### Bank account
- 49 1020 2892 2276 3005 0000 0000
