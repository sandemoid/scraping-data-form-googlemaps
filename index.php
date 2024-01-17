<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Businesses Select</title>
</head>

<body>
    <h1>Select Business</h1>

    <?php
    // Read JSON data from the file
    $jsonContent = file_get_contents('places.json');

    // Decode JSON data
    $businesses = json_decode($jsonContent, true);

    if ($businesses === null) {
        die('Error decoding JSON data');
    }

    // Display select dropdown
    echo '<select>';
    foreach ($businesses as $business) {
        echo '<option value="' . htmlspecialchars($business['index']) . '">'
            . htmlspecialchars($business['storeName'] . ' | ' . $business['phone']) . '</option>';
    }
    echo '</select>';
    ?>

</body>

</html>