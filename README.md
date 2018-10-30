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
1. Upon entering the customer view, the app will list all of the current products in the database and ask you which product you would like to purchase:

    ![customer_start](../master/images/customer_start.png)

1. Enter the id of the product and the quantity you would like to purchase

    * If there is enough of the product in storage to meet your request, the app will return the total cost of your order: 

        ![customer_purchase](../master/images/customer_purchase.png)

    * If storage is not sufficent, the app will alert you that the order failed and ask if you would like to continue shopping:

        ![order_failed](../master/images/order_failed.png)

1. If you choose to continue shopping, the app will list all of the current products again:

    ![continue_shopping](../master/images/continue_shopping.png)

### Manager View
1. When using the manager view, the app will list four commands: 

    ![manager_commands](../master/images/manager_commands.png)

    * `View Products for Sale` will display all of the products currently for sale:

        ![products_for_sale](../master/images/products_for_sale.png)
    
    *  `View Low Inventory` will display products with an inventory count less than five:

        ![low_inventory](../master/images/low_inventory.png)

        * The app will alert you if there are no products with low inventory:

            ![adequately_stocked](../master/images/adequately_stocked.png)
    
    * `Add to Inventory` will allow you to add inventory to a specific product:

        ![add_inventory](../master/images/add_inventory.png)

    * `Add New Product` will allow you to add a new product for sale. The app will ask you to enter the product name, department, price, and stock of the new product:
    
        ![add_product](../master/images/add_product.png)
    
1. When done with current command, the app will ask if you would like to use another command: 

    ![another_command](../master/images/another_command.png)
