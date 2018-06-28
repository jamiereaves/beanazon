# beanazon

## Overview

Beanazon is a storefront app built with mysql and node.js that takes orders for and tracks the stock of a variety of delicious beans. When the beanazonCustomer app is run, a table is generated that displays the different beans for sale and current inventory levels. The user is then prompted to enter the beanazon ID of the bean in which the user is interested and the amount of beans the user would like to buy via command line interface. If the quantity of the desired product is less than or equal to the stock on hand, an order is placed, the inventory is updated and the user is informed of the details of their order (price, quantity, type of bean). If there is insufficient stock, the user is notified that the order was unable to be placed.  In either case, the user is then asked if they wish to place another order. If the user wants to place another order, the process begins again; otherwise, the app closes.

## Application Demonstration

1. When the application is run from the terminal, a table that displays the ID, name, region of origin (i.e. category), price per kg, and current inventory level is generated and the user is prompted to enter the ID of the bean that is desired. The user is prevented from entering anything other than a positive integer.
![First Example](/images/readme1.png)
1. Once the user has chosen a bean, the user is prompted to choose the desired quantity (in kg) of their chosen bean. Again, the user is prevented from entering anything other than a positive integer.  If the desired quantity is greater than the amount in the store's inventory, a message explaining the problem is generated, the stock is not updated and the user is asked if they would like to order more beans.
1. If the desired quantity is less than, or equal to, the amount in the store's inventory, the order is placed, the stock is updated, a message is displayed containing the type of bean, the amount ordered, and the price charged, and the user is asked if they would like to order more beans.
![GitHub Logo](/images/readme2.png)
1. If the user would like to continue, a table displaying the updated inventory levels is generated and the process starts over again. If the user would not like to continue, the application ends.
![GitHub Logo](/images/readme3.png)
![GitHub Logo](/images/readme4.png)

## Future Additions

I was able to add the View All Products, View Low Inventory, Add to Inventory functions to the beanazonManager.js app, but haven't been able to add screenshots and updated descriptions to the readme before the submission deadline.  Will add the last function and update the readme asap.
