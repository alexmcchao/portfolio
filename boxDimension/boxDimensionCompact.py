from pandas import ExcelFile
import pandas as pd
import pyodbc
import sys
import datetime as dt
from datetime import datetime
from datetime import date
import xlsxwriter
import numpy as np

#for 184
db = pyodbc.connect('Driver=/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.2.so.0.1;'
                        'Server=192.168.168.197;'
                        'Database=itweb;'
                        'UID=progtest;'
                        'PWD=prog123')
#for 183
'''db = pyodbc.connect('Driver=/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.4.so.2.1;'
                        'Server=192.168.168.197;'
                        'Database=itweb;'
                        'UID=progtest;'
                        'PWD=prog123')'''
#for local
'''db = pyodbc.connect('Driver={SQL Server};'
                      'Server=SQL-server;'
                      'Database=itweb;'
                      'UID=progtest;'
                      'PWD=prog123')'''

#if component does not exist, make component column value the same as the kit column value
def kitToComponent(input):
    output = ""
    if pd.isna(input['ComponentItemCode']):
        output = input['SalesKitNo']
    else:
        output = str(input['ComponentItemCode'])
    return output


filePath = sys.argv[1]

df1 = pd.read_excel(filePath)

df2 = pd.read_sql("SELECT [SalesKitNo], [ComponentItemCode], [QuantityPerAssembly] FROM [ITWeb].[dbo].[kit]", db)

df3 = pd.read_sql("SELECT [ItemCode],[ShipWeight],[UDF_HEIGHT],[UDF_LENGTH],[UDF_WIDTH] FROM [MASReporting].[dbo].[CI_item]", db)

db.close()

#df1 left merge df2 to get componentItemCode
newdf = df1.merge(df2, left_on='SalesKitNo', right_on='SalesKitNo', how='left')
#transfer empty component cells to their kit cells
newdf['ComponentItemCode'] = newdf.apply(kitToComponent, axis=1)
#newdf left merge with
newdf2 = newdf.merge(df3, left_on='ComponentItemCode', right_on='ItemCode', how='left')
newdf2 = newdf2.fillna(0)
newdf2['SalesKitNo'] = newdf2['SalesKitNo'].astype('str')
#This part handles the Quantity per assembly, in which we append a new row if the Quantity per assembly is > 1. The new row have all the same data, but the Quantity per assembly will be 1 so we don't count them again.
for i in range(newdf2.shape[0]):
    for j in range(int(newdf2.iloc[i,2])-1):
        newdf2 = newdf2.append({'SalesKitNo' : newdf2['SalesKitNo'][i] , 'ComponentItemCode' : newdf2['ComponentItemCode'][i] ,
                       'QuantityPerAssembly': int(1) , 'ItemCode': newdf2['ItemCode'][i],
                       'ShipWeight': newdf2['ShipWeight'][i], 'UDF_HEIGHT': newdf2['UDF_HEIGHT'][i],
                       'UDF_LENGTH': newdf2['UDF_LENGTH'][i], 'UDF_WIDTH': newdf2['UDF_WIDTH'][i]}, ignore_index=True)
newdf2 = newdf2.sort_values(by=['SalesKitNo'])

#catagorize rows by the sales kit, this will be used in pivot later
newdf2['count'] = 1
for i in range(newdf2.shape[0]-1):
    if newdf2.iloc[i+1,0] == newdf2.iloc[i,0]:
        newdf2.iloc[i+1,8] = newdf2.iloc[i,8] +1
    else:
        newdf2.iloc[i+1,8] = 1

#form the string for pivot, seperated by *
newdf2.iloc[:,-5:-1] = newdf2.iloc[:,-5:-1].astype('str')

newdf2["all"] = newdf2["UDF_LENGTH"] + "*" + newdf2["UDF_WIDTH"] + "*" + newdf2["UDF_HEIGHT"]+ "*" + newdf2["ShipWeight"].map(str)

#use pivot on column count, index as SalesKitNo
finalls = newdf2.pivot(index='SalesKitNo', columns='count')['all']
#
for i in range(1, newdf2['count'].max()+1):
    x = finalls.iloc[:,i-1].str.split("*", n = 4, expand = True)
    x.rename(columns={x.columns[0]: "Box"+str(i)+" LENGTH",
                                            x.columns[1]: "Box"+str(i)+" WIDTH",
                                           x.columns[2]: "Box"+str(i)+" HEIGHT",
                                           x.columns[3]: "Box"+str(i)+" WEIGHT"}, inplace = True)
    finalls = pd.concat([finalls, x], axis=1, sort=False)
finalls = finalls.iloc[:,newdf2['count'].max():]
finalls = finalls.astype(float).apply(np.ceil).fillna(-9999).astype(int).replace(-9999, np.NaN)


numOfRows = finalls.shape[0]
numOfColumns = finalls.shape[1]
# Create a Pandas Excel writer using XlsxWriter as the engine.
writer = pd.ExcelWriter('boxDimensionCompact.xlsx', engine='xlsxwriter')

# Convert the dataframe to an XlsxWriter Excel object.
finalls.to_excel(writer, sheet_name='Sheet1')

# Get the xlsxwriter workbook and worksheet objects.

workbook  = writer.book
worksheet = writer.sheets['Sheet1']
data_format1 = workbook.add_format({'bold': True})
data_format2 = workbook.add_format({'bg_color': '#D3D3D3', 'border': 1})
data_format3 = workbook.add_format({'bg_color': '#FFFFFF', 'border': 1})
indicator = 1
for column in range(0, numOfColumns, 4):
    if indicator % 2 == 0:
        worksheet.set_column(column+1, column+4, cell_format = data_format2)
    else:
        worksheet.set_column(column+1, column+4, cell_format = data_format3)
    indicator += 1


worksheet.set_column(0, numOfColumns, 24)
worksheet.freeze_panes(1, 1)
worksheet.autofilter(0,0,numOfRows, numOfColumns )
# Add some cell formats.
writer.save()
