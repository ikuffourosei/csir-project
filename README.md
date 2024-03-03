# CSIR BRRI WEB MAP PROJECT
Creating an interractive web map that visualizes roads prone to accident on the N6 and N10 highway.
This web map will be accessible to the general public and also to the transport division in BRRI

# AIM
- To educate drivers on road spots prone to accident

## DATA
- Road accident data collected over the N6 and N10 highway stretch
- Region data
- All road data 

## FUNCTIONALITIES
The web map is to have a pop feature, a search or query feature and layers to switch base map views.

## 1. SEARCH 
### REGIONS:
The search feature should be implemented such that a user can search for name of region and upon results
- zoom in to the searched region and highlight the accidents that has occurred on the highway passing through that region.
- Display the name of the search region (eg. Ashanti)

### KM POST
The search feature should also be implemented such that a user can search for approximated Distance (say from 1 - 1000) such that:
- If a user searches for 10, all spots of accidents with DKM (KM Post) value of 10 should be returned (i.e 10, 10.5, 10.9). If none, pass
- If search is true for say KM POST 10.5, it should display the coordinates of that distance and pops up together with accident details.
