### D3-challenge
# Data Journalism and D3

## Overview

Using 2014 ACS 1-year estimates data from the U.S Census Bureau and the Behavioral Risk Factor Surveillance System, analyze current trends shaping people's lives by creating scatter plots with interactive elements. The dataset includes data on poverty, age, lack of healthcare, and smoking.


### Files and Folders

* [D3_data_journalism](D3_data_journalism/) - this folder holds all the files for this challenge
    * [Main Page](D3_data_journalism/index.html) - this *index.html* file is the webpage that should be opened in a browser and displays the scatter plots.
        * [assets](D3_data_journalism/assets) - this folder holds all the files and subfolders used to format and manipulate the webpage
            * [css](D3_data_journalism/assets/css/) - this folder holds the stylesheet files that help format the webpage
                * [d3Style.css](D3_data_journalism/assets/css/d3Style.css) - this *CSS* file contains the D3 formatting for the webpage including the D3-tip styling
                * [style.css](D3_data_journalism/assets/css/style.css) - this *CSS* file helps format the webpage
            * [data](D3_data_journalism/assets/data/) - this folder holds the dataset file that was used
                * [data.csv](D3_data_journalism/assets/data/data.csv) - this *CSV* file contains the Census Bureau dataset
            * [js](D3_data_journalism/assets/js/) - this folder holds the the *JavaScript* file
                * [.eslintrc.json](D3_data_journalism/assets/js/.eslintrc.json)
                * [app.js](D3_data_journalism/assets/js/app.js) - this file contains the *JavaScript* script that manipulates the *HTML* page; this file is for the **Core Assignment** part of the challenge
                * [bonusapp.js](D3_data_journalism/assets/js/bonusapp.js) - this file contains the *Javascript* script that manipulates the *HTML* page; this file is for the **Bonus** part of the challenge


## Development and Analysis

### Core Assignment: D3 Dabbler

We started out with an HTML page that had the `<div>` tags for the scatter plot and some generic text to represent the analysis. We also had the other files listed above with the exception of the *bonusapp.js* file which I created later to hold the code for the *Bonus* section. The *app.js* file was empty so started with a clean slate on that front. Since our Core assignment required using only one data item for the x-axis and one for the y-axis, I decided to use poverty for the x-axis and lack of healthcare for the y-axis.

The first task I started with was to get the connection to the *CSV* data file working and pulling. Since a majority of the colunns contained numeric data, I used the `autoType` function. That way I didn't need to convert each column from a string, which is how *CSV* files are parsed. After setting that up and getting that to work, I then moved on to setting up the SVG container information. I ended up testing a few different settings for the margins before deciding on the ones I used.

Next came setting up the scales for both axes. Since I was using poverty for the x-axis and the data contained a margin of error column for poverty, I incorporated that into the calculation of the `.domain` portion of the `scale` function. 

With the axes scales set up, on to the circles and their state abbreviation text. Adding the circles went pretty smoothly but I ran into issues with getting the state abbreviations inside the circles. At first I was getting no state abbreviations at all. Once that was resolved, I couldn't get the text to be centered inside the circles; it was more half in/half out. After doing some *Google* searching, I found two properties to do that--`text-anchor` and `alignment-baseline`. After I added both of those as attributes to the state abbreviation text portion, the state abbreviations were centered inside their respective circles in the scatter plot.

Then I added the axes titles and ended up running into a similar issue to the state abbreviations not being centered; the axes titles were not centered along their axes. So I tried using the `text-anchor` property with those as well and that fixed that issue.

The only item remaining based on the example we had for how this scatter plot should look was removing the first tick and label along each axis. I tried several different approaches but found that the only one I could get to actually work like I wanted was to use `.filter` and to manually add what numbers not to show. It's a little clunky but for this particular instance, it worked. The end result is as follows:

![Images/core.PNG](Images/core.PNG)

### Bonus: Impress the Boss

To do the *Bonus* section, I first started with the code I used from the *Core* assignment and saved that to a new file called *bonusapp.js*. This is the file I used for the *Bonus* section, just in case I couldn't get it working but in the process messed up the original *Core* code. So the *app.js* file was not modified or used directly for the *Bonus* section. I did have to add a new `<script>` element to the *index.html* file to use the *bonusapp.js* file instead.

With all that set up, I started adding to the *bonusapp.js* file. I did change the left margin to account for the additional axes title labels. I added parameters to hold informtion about which x or y axis label was selected and the data that goes along with it. Since the data changes are controlled by clicking one of the axes' labels, I needed to set those parameters up with initial values so there would be data showing initially. Had to modify the scales calculations to accept the parameters. Started with just working on the x-axis but once I got all the code added and working, I mainly duplicated that for the y-axis changes as well. I did add a *click* event and *transition* code to trigger the circle and axes scale changes and have those changes display visually.

I did run into an issue with circles and the state abbreviations. I could get the circles to transition but the state abbreviations wouldn't move. Resolved that by adding group tags to the SVG container for the circles and the state abbreviations and then adding the circles and text to those.

Next I added the *d3-tip* tooltips to each circle. I did this by adding a `<script>` tag to the *index.html* file for the *d3-tip* library. Then I added some styling to the *d3Style.css* file. After that, I started modifying the code in the *bonusapp.js* file. I added the *tip* function, and a *tooltip* function for what data and how that data would be displayed, and added the `.on('mouseover, )` and `.on(mouseout`) properties to the circles append function. One issue I ran into there was that poverty is a percentage whereas age is a not. But both are on the x-axis and needed to be displayed in the tooltip correctly. At first I was going to just have the *(%)* shown as part of the label in the tooltip so the number from the data would display just that, a number. But I figured out how to add or remove the *%* depending on which label was clicked so I used that approach instead.

The end result is below:

![Images/bonus.PNG](Images/bonus.PNG)


## Notes

The webpage uses the *bonusapp.js* file initially. That contains the *Bonus* section of this challenge but since that's basically embellishment to the *Core* assignment and built from that initial code, the *Core* assignment is part of that. However, should you need to see just the *Core* assignment, you can comment out the *bonusapp.js* `<script>` tags found in the *footer* section of the *index.html* file and uncomment out the *app.js* `<script>` tags. Below is a screenshot of the *footer* section of the *index.html* file where that change should be made:

![Images/changing_js_file.PNG](Images/changing_js_file.png)

The tooltip hover is a little temperamental. If you hover over the center of the circle it doesn't appear. However, if you hover along the edge of the circle it works just fine.

I used *healthcareHigh* in the `.domain` scale setup for the y-axis in the *app.js* file. This put a little extra room on the y-axis. Tried that in the *bonusapp.js* file but there was data 
missing from the smoking data in that field so it would error out. So decided to use the non-High field in *bonusapp.js* but keep the *healthcareHigh* field in the *app.js* file.

I used the `switch` statement in the update tip text portion of the script. Could've used `If/Else` but it seemed like good choice for mulitple options, especially when I was hoping to get all three x and y axes labels working instead of just two each. But it also allowed me to use that statement which I hadn't before, so that was good knowledge to utilize.

If there was more time, I would've liked to have done the three x and y axes options.
