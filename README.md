# storefront

## Please note that the manager script imports from the customer script. Running the manager script without commenting out the initMenu() in the customer script causes the customer menu to load when running the manageer script.

### Customer

![Customer Image](/customer.png)
Format: ![Alt Text]()

This shows the general use pattern for the customer script. It prints a table of all the available stock, then prompts the user for what they want to buy, then how much.

Once inputs are recieved, it updates the database and then prints an updated table for the customer to continue shopping

![Manager Image](/managerviewlowadddstock.png)
Format: ![Alt Text]()

This shows part of the use of the manager script. Starting the script brings up a menu with a selection of options. The first is view products, which prints a table of the current database.

The second option "View Low Inventory" prints out the items that have a stock_quantity less than 5

The third option "Add to Inventory" prompts the manager for some information and then increases the stock of the chosen item as specified by the user. Table is not automatically printed again, but "View Products" is run again to show that the database is updated.

![Manager Image](/managerviewaddnew.png)
Format: ![Alt Text]()

This image shows the use of the "Add new product" option in the menu, as well as another "View Products" showing that the item was added successfully.

The very last section is the menu that allows the user to make the selection of what they want to do.

### Supervisor

![Supervisor](/supervisor.png)
Format: ![Alt Text]()

This image shows the supervisor script in use. The first action available to this script is to view a table that aggregates and presents information about how each individual department is faring.

The second action allows the supervisor to add a new department into the database.

The last section shows the menu that controls the script.