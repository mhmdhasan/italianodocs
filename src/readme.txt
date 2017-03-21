################################################################################################

Readme for the Ads - Bootstrap Classifieds Theme by Ondrej Svestka - https://ondrejsvestka.cz

################################################################################################

Hi,

thank you for downloading. I hope you wil enjoy working with the theme.

Ondrej


CSS
----------

The theme stylesheet is css/style.default.css. If you want to make any changes, you can do it here or better to override it in custom.css so you can update the original theme stylesheet if an updated is released. Colour variants are named accordingly, to use different colour variant, just replace link to the style.default.css with e.g. style.pink.css.

LESS
----------
The easies way to change theme colours, fonts and any CSS rules in general is by editing the LESS files. In the LESS directory, there is a main file style.default.less or its colour variants. In these files, we just define which of the predefined colours will be use and the rest is done by core.less file. It takes control of all the necessary module includes. 
The modules (blog, footer, navbar, pages, etc.) are located in the modules subdirectory. 
Most modifications can be done by configuring the theme in variables-custom.less.

Javascript
----------

Apart from Bootstrap JS components majority of JS is located in /js/front.js. If you want to make any js settings finetuning, you can do it here.

Credits
---------

- Bootstrap 
- Font Awesome 
- Google Fonts
- Owl Carousel