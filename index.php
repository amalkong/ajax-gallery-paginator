<?php
function check_for_slash($path,$convertSlash=true) {
	if (substr($path, (strlen($path) - 1), 1) != "/") $path = $path . "/";
	if($convertSlash == true) $path = str_replace('\\','/',$path);
		
	return($path);
}
$out = '';
$path = isset($_REQUEST["path"]) ? $_REQUEST["path"] : "C:/xampp/htdocs/www/_assets/img/gallery/";
$path = check_for_slash($path);
$startIndex = isset($_REQUEST["startIndex"]) ? $_REQUEST["startIndex"] : 0;
$perPage = isset($_REQUEST["perPage"]) ? $_REQUEST["perPage"] : 5;
$responseType = isset($_REQUEST["responseType"]) ? $_REQUEST["responseType"] : "json";
$description = isset($_REQUEST["description"]) ? $_REQUEST["description"] : "Photos from the android development folder";
$title = isset($_REQUEST["title"]) ? $_REQUEST["title"] : "Android Gallery";

$allImages = glob("$path*{jpg,gif,png}",GLOB_BRACE);
$albumPhotos = '
{
	"title":"'.$title.'",
	"description": "'.$description.'",
	"startIndex": '.$startIndex.',
	"images" :[';
        if(is_array($allImages) && sizeof($allImages) >  0){
			$total_images = sizeof($allImages);
			for($i=0;$i<$total_images;$i++){
				if(isset($allImages[$i])){
					$name = basename($allImages[$i]);
					$path = dirname($allImages[$i]);
					$image_url = check_for_slash(str_ireplace('C:/xampp/htdocs/www/', 'http://localhost/www/', $path)).$name;
		         	$albumPhotos .= "\"$image_url\",";
		          	$out .= "<li><img src=\"$image_url\" alt=\"".basename($image_url)."\" /><li>";
		        }
        	}
			$albumPhotos = trim($albumPhotos, ",");
        }$albumPhotos.= '
	]
}
';

if(isset($_REQUEST["path"]) && isset($_REQUEST["is_ajax_call"]) && ($_REQUEST["is_ajax_call"] === 1 || $_REQUEST["is_ajax_call"] === "1")){
	//echo '<ul id="photos">'.$out.'</ul>';
	echo trim($albumPhotos, ",");
} else {
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Album</title>
        <link rel="stylesheet" href="./style.css" />
    </head>
    <body class="gray-gradient">
        <div class="overlay"></div>
        <div id="album-info-box" class="album-info-box">
            <h1 id="album-info-title">Album</h1>
            <p id="album-info-page"></p>
            <p id="album-info-description"></p>
			
			<div style="display: flex;gap: 1rem;margin-top: 1rem;margin-bottom: 1rem;text-align: center;">
				<div class="switch-wrapper">
					<div id="showAllSwitch" class="onoffswitch">
						<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="showAllToggler">
						<label class="onoffswitch-label" for="showAllToggler" title="Show all items or show the default amount?">
							<div class="onoffswitch-inner">
								<div class="onoffswitch-active">
									<div class="onoffswitch-switch">ALL</div>
								</div>
								<div class="onoffswitch-inactive">
									<div class="onoffswitch-switch"><?php echo $perPage;?></div>
								</div>
							</div>
						</label>
					</div>
					
					<div id="shuffleSwitch" class="onoffswitch">
						<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="shuffleToggler" checked>
						<label class="onoffswitch-label" for="shuffleToggler" title="Shuffle items?">
							<div class="onoffswitch-inner">
								<div class="onoffswitch-active">
									<div class="onoffswitch-switch">ON</div>
								</div>
								<div class="onoffswitch-inactive">
									<div class="onoffswitch-switch">OFF</div>
								</div>
							</div>
						</label>
					</div>
				</div>
				
				<div id="" class="" style="display: flex;flex: 1;">
					<form id="imageForm" method="POST" action="." >
						<input type="hidden" name="is_ajax_call" value="1" />
						
						<div class="input-block-wrapper">
							<span class="input-block">
								<label for="perPage" title="how many items should be displayed per-page">per page: </label>
								<select id="perPage" name="perPage">
									<?php for($i=5;$i<26;$i++){echo '<option value="'.$i.'" '.($perPage === $i?"selected":"").'>'.$i.'</option>';} ?>
								</select>
							</span>
							<span class="input-block">
								<label for="responseType" title="What Response Type should be expected">res. type: </label>
								<select id="responseType" name="responseType">
									<option value="text">text</option>
									<option value="json" selected>json</option>
								</select>
							</span>
							<span class="input-block">
								<label for="path" title="path to image files">path: </label>
								<input type="text" name="path" value="<?php echo $path;?>" title="<?php echo $path;?>" />
							</span>
							<button class="btn" type="submit" name="submit">GO!</button>
							<button id="metaBoxToggler" class="btn" type="button">&darr;</button>
						</div>
						<div class="meta-box input-block-wrapper">
							<span class="input-block">
								<label for="title" title="title">title: </label>
								<input type="text" name="title" value="<?php echo $title;?>" title="<?php echo $title;?>" />
							</span>
							<span class="input-block">
								<label for="description" title="description">description: </label>
								<input type="text" name="description" value="<?php echo $description;?>" title="<?php echo $description;?>" />
							</span>
						</div>
					</form>
				</div>
			</div>
		
        </div>
		
        <ul id="photos"><?php //echo $out;?></ul>
		
        <div id="imageFrame" class="imageFrame">
		    <div id="imageFrameControls" class="imageFrameControls">
				<span class="mr--auto">
					<a id="zoom-out-btn" class="btn" href="javascript:void(0)" title="zoom image out">&nbsp;&minus;&nbsp;</a>
					<a id="zoom-in-btn" class="btn" href="javascript:void(0)" title="zoom image in">&nbsp;&plus;&nbsp;</a>
					<a id="zoom-reset-btn" class="btn" href="javascript:void(0)" title="reset zoom">&nbsp;[0]&nbsp;</a>
					<a id="prev-img-btn" class="btn" href="javascript:void(0)" title="show previous image">&nbsp;&lt;&nbsp;</a>
					<a id="next-img-btn" class="btn" href="javascript:void(0)" title="show next image">&nbsp;&gt;&nbsp;</a>
				</span>
                <span class="m--auto gap--1">
					<select id="wrapper-size-select" class="btn">
						<option value="default">default</option>
						<option value="medium">medium</option>
						<option value="full">full</option>
					</select>
					<select id="object-fit-select" class="btn">
						<option value="cover">cover</option>
						<option value="contain">contain</option>
						<option value="fill">fill</option>
						<option value="scale-down">scale-down</option>
						<option value="none">none</option>
					</select>
				</span>
				<span class="ml--auto">
					<a id="fit-to-window-btn" class="btn" href="javascript:void(0)" title="fit image to container">&nbsp;[+]&nbsp;</a>
					<a id="image-frame-close-btn" class="btn" href="javascript:void(0)" title="close image frame">&nbsp;<i>(&times;)</i>&nbsp;</a>
				</span>
            </div>
            <div id="mainImageWrapper" class="mainImageWrapper">
                <div id="prev-preview" class="thumb-preview prev-preview"></div>
                <div id="next-preview" class="thumb-preview next-preview"></div>
                <img id="mainImage" class="mainImage" />
	        </div>
	    </div>
        <div id="pager" class="visible">
            <a id="prev" href="/">< prev</a>
			<div id="paginator"></div>
            <a id="next" href="/">next ></a>
        </div>
        <p><a href="../browser-api-demo-master/slider.html">View other slider</a> or View more <a href="https://www.google.com/search?q=grim+fandango">Grim Fandango</a> photos.</p>
        
		<script type="text/javascript">
			let _perPage = <?php echo $perPage;?>;
		    let albumPhotos = <?php echo $albumPhotos;?>;
		</script>
        <script type="text/javascript" src="./app.js"></script>
    </body>
</html>
<?php } ?>
