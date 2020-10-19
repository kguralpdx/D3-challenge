### D3-challenge
# Data Journalism and D3

## Overview

Using 2014 ACS 1-year estimates data from the U.S Census Bureau and the Behavioral Risk Factor Surveillance System, analyze current trends shaping people's lives by creating scatter plots with interactive elements. The dataset includes data on poverty, age, lack of healthcare, and smoking.


### Files and Folders

* [D3_data_journalism](D3_data_journalism/) - this folder holds all the files for this challenge
    * [Main Page](D3_data_journalism/index.html) - this *index.html* file is the webpage that should be opened in a browser and displays the scatter plots.
        * [assets](D3_data_journalism/assets) - this folder holds all the files and subfolders used to format and manipulate the webpage
            * [css](D3_data_journalism/assets/css/) - this folder holds the stylesheet files that helps format the webpage
                * [d3Style.css](D3_data_journalism/assets/css/d3Style.css) - this *CSS* file contains the D3 formatting for the webpage including the D3-tip styling
                * [style.css](D3_data_journalism/assets/css/style.css) - this *CSS* file helps format the webpage
            * [data](D3_data_journalism/assets/data/) - this folder holds the dataset file that was used
                * [data.csv](D3_data_journalism/assets/data/data.csv) - this *CSV* file contains the Census Bureau dataset
            * [js](D3_data_journalism/assets/js/) - this folder holds the the *JavaScript* file
                * [.eslintrc.json](D3_data_journalism/assets/js/.eslintrc.json) - 
                * [app.js](D3_data_journalism/assets/js/app.js) - this file contains the *JavaScript* script that manipulates the *HTML* page; this file is for the **Core Assignment** part of the challenge
                * [bonusapp.js](D3_data_journalism/assets/js/bonusapp.js) - this file contains the *Javascript* script that manipulates the *HTML* page; this file is for the **Bonus** part of the challenge



## Development and Analysis

### Core Assignment: D3 Dabbler

We started out with an HTML page that had the `<div>` tags for the scatter plot and some generic text to represent the analysis. We also had the other files listed above with the exception of the *bonusapp.js* file which I created later to hold the code for the *Bonus* section. The *app.js* file was empty so started with a clean slate on that front. Since our Core assignment required using only one data item for the x-axis and one for the y-axis, I decided to use poverty for the x-axis and lack of healthcare for the y-axis.

The first task I started with was to get the connection to the data working and pulling. Since a majority of the colunns contained numeric data, I used the `autoType` function. That way I didn't need to convert each column from a string, which is how *CSV* files are parsed. After setting that up and testing it out, then moved on to setting up the SVG container information. Tested a few different settings for the margins before deciding on the ones I used.

Next came setting up the scales for both axes. Since I was using poverty for the x-axis and the data contained a margin of error column for poverty, I incorporated that into the calculation of the `.domain` portion of the `scale` function. 

With the axes scales set up, on to the circles and their state abbreviation text. Adding the circles went pretty smoothly but I ran into issues with getting the state abbreviations inside the circles. At first I was getting no state abbreviations at all. Once that was resolved, I couldn't get the text to be centered inside the circles; it was more half in/half out. After doing some *Google* searching, found two properties to do that--`.attr("text-anchor", "middle")` and `.attr("alignment-baseline", "central")`. After I added both of those to the state abbreviation text portion, the state abbreviations were centered inside their respective circles in the scatter plot.

Then I added the axes titles and ended up running into a simmiliar issue to the state abbreviations not being centered; the axes titles were not centered along their axes. So I tried using the `text-anchor` property with those as well and that fixed that issue.

The only item remaining based on the example we had for how this scatter plot should look was removing the first tick and label along each axis. I tried several different approaches but found that the only one I could get to actually work like I wanted was to use `.filter` and to manually add what numbers not to show. It's a little clunky but for this particular instance, it worked.

### Bonus: Impress the Boss

I decided to try doing the gauge chart because I had some time and I wanted to see how to do it. I now know why it was called an *Advanced* challenge. I first went down the path of a *Plotly* gauge chart. It had the right shape but I couldn't find anything about how to add the needle. After much *Google* searching, I came about a few articles about using a pie chart instead. I did find one article that did a good job of breaking it all down except his gauge didn't have as many sections. But most of the code i used was found [here](https://com2m.de/blog/technology/gauge-charts-with-plotly/). That got me most of the way there except the needle wasn't really working as far as I could tell. After adding some *Values* and *Direction* information from [here](https://stackoverflow.com/questions/53211506/calculating-adjusting-the-needle-in-gauge-chart-plotly-js), I was closer but still had the needle barely moving. After thinking it through a bit more, realized that the *wash frequencies* being used were not in degrees, so fixed that by multiplying those by 20 which got the needle pointing to the correct place on the gauge. Searched out a colorscheme for the background colors of each segment and added that. 

The end result is below:

![Images/bb_dashboard.PNG](Images/bb_dashboard.PNG)


## Notes

Set Test Subject ID 940 as the default for when the page opens. It's the first one in the list so seemed like the natural choice to use for the default. That way, when the user uses the dropdown list for the first time, all the choices are listed below instead of potentially having to scroll up the list as well.

I used *newPlot* for each plot in the *optionChanged* function instead of *restyle*. At first it seemed like *restyle* should be used because the plots already existed. But there wasn't anything to update, the underlying data was changing but none of the attributes were, so *newPlot* seemed like the better route.

The gauge is rather small on the dashboard but when I tried to make it larger, it didn't display correctly so I just left it as it.

The style information for the gauge and the `<ul>` tags is in both the *index.html* file and the *style.css* file. I tried to remove them from one or the other and couldn't get the formatting to work so just left them both in place.

I'm amazed at how many times I used `console.log()` and the amount of time analyzing results in *Google Inspector*. Both were invaluable for this challenge. Didn't realize how much I was looking at through *Google Inspector* until I was cleaning up my script at the end and having to delete `console.log()` entries over and over again.
