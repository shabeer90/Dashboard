# Sales Dashboard

The dashboard is an interactive view of data that displays daily and monthly sales data with week on week percentage difference. Highlights supplier-to-depot delivery shortages. Highlights depot-to-store delivery shortages. Visualises sales and service patterns. Sends performance alerts to users daily
Enabling users to see patterns, explore trends and understand the insight living in data like never before. 

##### Technologies used : 

  - JavaScript
  - jQuery 
  - BackboneJS
  - NVD3
  - D3
  - Grunt
  - RequireJS
  - LESS
  - Bootstrap
  
##### Structure Overview 
The code that builds the chart is in folder `retailer_x/js/`. I have used `RequireJS` to Modularize my code. `main.js` takes care of initializes the charts on the Dashboard page, and loads all relevent JavaScript on the page.

The `views` take care of drawing the charts on the page. 
+ AtheonChartBase.js
  + AtheonHorizontalChartBase.js
    - DailySalesView.js
    - CasesShortedBase.js
      - DepotView.js
      - SupplierView.js
  + AtheonVerticalChartBase.js	
    - MonthlySalesView.js
  + PerformanceChartBase.js
    - AvailabilityView.js
    - DepotServiceView.js
    - SupplierServiceView.js
+ PriceChangeBaseView.js
  + PriceChangeView.js
