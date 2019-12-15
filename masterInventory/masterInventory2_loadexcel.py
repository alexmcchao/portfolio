import pandas as pd
from pandas import ExcelWriter
from pandas import ExcelFile
import pymssql
import sys
import datetime
from datetime import datetime
import xlsxwriter


def giveZero(i):
    if (i<0):
        return 0
    else:
        return i

# Open database connection
db = pymssql.connect("xxx", "xxx", "xxx", "xxx")

# prepare a cursor object using cursor() method
cursor = db.cursor(as_dict=True)

#execute query
cursor.execute("SELECT * FROM xxx ORDER BY ItemSKU ASC")

#fetch data from database
rows = cursor.fetchall()

#create arrays for dataframe
ItemSKU = []
totalinv = []
foawmsinv = []
foainv = []
wmsinv = []
yard_qty = []
owtqty = []
poqty = []
bookqty = []
neweta = []
newItemType = []
cgqty = []
sofsqty = []
gaqty = []
njqty = []
txqty = []
Carton = []

#get values from cursor and store in arrays
bigDate = datetime(5000,1,2)
for row in rows:
    #print("%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s" % (row['ItemSKU'], row['mininv'], row['inv'], row['foainv'],
    #row['wmsinv'], row['yard_qty'], row['owtqty'], row['poqty'], row['bookqty'], row['mineta'], row['itemType'], row['gaqty'],
    #row['cgqty'], row['sofsqty'], row['njqty'], row['txqty']))
    ItemSKU.append(row['ItemSKU'])
    #mininv.append(row['mininv'])
    #inv.append(row['inv'])
    totalinv.append(row['totalinv'])
    foawmsinv.append(row['foawmsinv'])
    foainv.append(row['foainv'])
    wmsinv.append(row['wmsinv'])
    yard_qty.append(row['yard_qty'])
    owtqty.append(row['owtqty'])
    poqty.append(row['poqty'])
    bookqty.append(row['bookqty'])
    #if(row['mineta'] != "" and datetime.strptime(row['neweta'], '%m/%d/%Y') < bigDate):
    neweta.append(row['neweta'])
    #print(row['mineta'])
    newItemType.append(row['newItemType'])
    cgqty.append(row['cgqty'])
    sofsqty.append(row['sofsqty'])
    gaqty.append(row['gaqty'])
    njqty.append(row['njqty'])
    txqty.append(row['txqty'])
    Carton.append(row['Carton'])

#close db
db.close()

# Create a Pandas dataframe from the data.
df = pd.DataFrame({
    'Item SKU': ItemSKU,
    'Total Sellable Inventory': totalinv,
    'FOA + WMS Inventory': foawmsinv,
    'FOA Sellable Inventory': foainv,
    'WMS Sellable Inventory': wmsinv,
    'CG Sellable Inventory': cgqty,
    'SOFS Sellable Inventory': sofsqty,
    'GA Sellable Inventory': gaqty,
    'TX Sellable Inventory': txqty,
    'NJ Sellable Inventory': njqty,
    'Yard Qty': yard_qty,
    'OnWater Qty': owtqty,
    'On PO Qty': poqty,
    'Book qty':bookqty,
    'ETA': neweta,
    'Item Type': newItemType,
    'Carton': Carton
})

numOfRows = df.shape[0]
numOfColumns = df.shape[1]
# Create a Pandas Excel writer using XlsxWriter as the engine.
writer = pd.ExcelWriter('MasterInventory.xlsx', engine='xlsxwriter')

# Convert the dataframe to an XlsxWriter Excel object.
df.to_excel(writer, sheet_name='Sheet1', index=False, columns=['Item SKU',\
'Total Sellable Inventory',\
'FOA + WMS Inventory',\
'FOA Sellable Inventory',\
'WMS Sellable Inventory',\
'CG Sellable Inventory',\
'SOFS Sellable Inventory',\
'GA Sellable Inventory',\
'TX Sellable Inventory',\
'NJ Sellable Inventory',\
'Yard Qty',\
'OnWater Qty',\
'On PO Qty',\
'Book qty',\
'ETA',\
'Item Type',\
'Carton'])

# Get the xlsxwriter workbook and worksheet objects.
workbook  = writer.book
worksheet = writer.sheets['Sheet1']

#set color
cell_format = workbook.add_format()
data_format1 = workbook.add_format({'bold': True})
data_format2 = workbook.add_format({'bg_color': '#BEFFF6'})

for row in range(0, numOfRows, 2):
    worksheet.set_row(row + 1, cell_format=data_format2)

worksheet.set_column(0, numOfColumns-1, 28)
worksheet.freeze_panes(1, 1)
worksheet.autofilter(0,0,numOfRows, numOfColumns -1)

# Add some cell formats.
writer.save()
