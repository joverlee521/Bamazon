# Bamazon

A command-line app that mimics the Amazon storefront using MySQL database. The app has three different views: customer, manager, and supervisor. The customer view takes orders from customers and depletes stock from the inventory. The manager view gives managers an overview of current products and allows them to add inventory or new products. The supervisor view tracks product sales across departments and allows supervisors to add new departments. 

## How To Use Bamazon

1. Create the Bamazon database by running the code in [bamazon.sql](../master/bamazon.sql) using MySQL Workbench
1. Navigate to the root of the Bamazon app in your terminal
1. Start the app by entering one of three commands: 
    * `node bamazonCustomer.js`
    * `node bamazonManager.js`
    * `node bamazonSupervisor.js`

### Customer View
1. Upon entering the customer view, the app will list all of the current products in the database and ask the customer which product they would like to purchase:

    ![customer_start](../master/images/customer_start.png)

