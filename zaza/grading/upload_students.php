<?php
// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "your_database_name"; // ← palitan mo ito

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check if file is uploaded
if (isset($_FILES['student_csv']) && $_FILES['student_csv']['error'] === UPLOAD_ERR_OK) {
  $file = $_FILES['student_csv']['tmp_name'];

  if (($handle = fopen($file, "r")) !== FALSE) {
    $row = 0;
    $inserted = 0;

    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
      if ($row == 0) {
        $row++; // skip header row
        continue;
      }

      // Clean and assign each column
      $student_id   = $conn->real_escape_string(trim($data[0]));
      $full_name    = $conn->real_escape_string(trim($data[1]));
      $grade_level  = $conn->real_escape_string(trim($data[2]));
      $section      = $conn->real_escape_string(trim($data[3]));

      // Insert into database
      $sql = "INSERT INTO students (student_id, full_name, grade_level, section)
              VALUES ('$student_id', '$full_name', '$grade_level', '$section')";

      if ($conn->query($sql)) {
        $inserted++;
      }

      $row++;
    }

    fclose($handle);
    echo "✅ Upload successful. $inserted students added.";
  } else {
    echo "❌ Failed to open the CSV file.";
  }
} else {
  echo "❌ No file uploaded or upload error.";
}

$conn->close();
?>