# ajax-gallery-paginator
An app which uses the fetch API as the AJAX, vanilla javascript for the gallery and paginaton display and PHP to retrieve the image files.

## Installation & Requirements
### Requirements
- Having PHP installed is essential, but there are work arounds
- A local or production server

### Installation
Extract the zip file to a folder on your server

### How to use
Open the <index.php> in a text editor of choice and edit the variables indicated below:

```
// Replace
$path = isset($_REQUEST["path"]) ? $_REQUEST["path"] : "C:/xampp/htdocs/www/_assets/img/gallery/";

//with
$path = isset($_REQUEST["path"]) ? $_REQUEST["path"] : "/path/to/your/images/";
//or hard coded path, eg
$path = "/path/to/your/images/";
```

optional config
```
// This indicates which paginaton page to begin from
$startIndex = isset($_REQUEST["startIndex"]) ? $_REQUEST["startIndex"] : 0;

// How many items should be displayed
$perPage = isset($_REQUEST["perPage"]) ? $_REQUEST["perPage"] : 5;

// This indicates what type of response should be expected
// NB: JSON is the default and only response that was optimized  for this app, 
// but others will be added in subsequent updates
$responseType = isset($_REQUEST["responseType"]) ? $_REQUEST["responseType"] : "json";

// Add a description of the images for display purposes
$description = isset($_REQUEST["description"]) ? $_REQUEST["description"] : "Photos from the android development folder";

// Add a title for display purposes
$title = isset($_REQUEST["title"]) ? $_REQUEST["title"] : "Android Gallery";
```
Save changes and open <index.php> a browser
