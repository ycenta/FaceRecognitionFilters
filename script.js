const video = document.querySelector("#video")
var image  = document.getElementById("facemoji");
var correction_position_x = 50;
var correction_position_y = 30;

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('models'),
	faceapi.nets.faceExpressionNet.loadFromUri('models')
	]).then(startVideo)


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function choosePic(pic_id, correction_x, correction_y){
  image.style.border = "";
  image  = document.getElementById(pic_id);
  image.style.border = "thick solid #0000FF";
  correction_position_x = correction_x;
  correction_position_y = correction_y;
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  var context = canvas.getContext("2d");
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height)
    //faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    

        if (typeof detections !== 'undefined') {
    // the variable is defined
          var box_height = detections["0"]["detection"]["_box"].height
          var box_width = detections["0"]["detection"]["_box"].width
          var box_x = detections["0"]["detection"]["_box"].x
          var box_y = detections["0"]["detection"]["_box"].y
          console.log(box_height+" "+box_width+" "+box_x+" "+box_y)
    }
   
    context.drawImage(image, box_x+correction_position_x, box_y+correction_position_y, box_width, box_height);


  }, 100)
})

