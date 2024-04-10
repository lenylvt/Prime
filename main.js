import '@supabase/supabase-js'

document.addEventListener('DOMContentLoaded', function(event) {
    ready();
})

async function ready() {
    // Initialize Supabase client
    const supabase = createClient('https://aitwrupedylviounnnuq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdHdydXBlZHlsdmlvdW5ubnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3Nzc0NTIsImV4cCI6MjAyODM1MzQ1Mn0.eTAxiYjSAXljt-ncHUIQNkVj4Kv5hjAYn6QC3j78XJE');

    // Fetch videos data from Supabase
    const { data: videos, error } = await supabase.from('videos').select('*');
    
    if (error) {
        console.error('Error fetching videos:', error.message);
        return;
    }

    // Parse out YouTube ID from the URL, as we'll use that to get the thumbnail
    videos.forEach(video => {
        let regex = /watch\?v=([\w\d-]*)/;
        video.youtubeID = video.url.match(regex)[1];
    });
    
    let featuredVideo = videos.find(video => {
        return video.isFeatured;
    });

    // Assuming you have lodash included in your project for _.groupBy
    let groupedVideos = _.groupBy(videos, 'category');
    var template = Handlebars.compile(document.getElementById("app-template").innerHTML);
    // Render items into Handlebars template, and set the html of the container element
    document.getElementById('app').innerHTML = template({
        featured: featuredVideo,
        videos: groupedVideos
    });

    // New code: Attach event listener to the container that holds the video cards
    document.getElementById('app').addEventListener('click', function(event) {
        // Check if the clicked element is a video link or inside a video link
        let videoLink = event.target.closest('.video-link');
        if (videoLink) {
            event.preventDefault(); // Prevent default anchor behavior
            let videoID = videoLink.dataset.youtubeId; // Get the YouTube ID
                
            // Dynamically create a media player to display the video
            let mediaPlayerHtml = `
                <media-player title="PRIME" src="youtube/${videoID}">
                    <media-provider></media-provider>
                    <media-video-layout thumbnails="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg"></media-video-layout>
                </media-player>
            `;
    
            // Display this media player somewhere in your page, for example, in a modal or a designated div
            // Here, I'll assume you have a div with ID 'videoDisplayArea' for displaying the video
            document.getElementById('videoDisplayArea').innerHTML = mediaPlayerHtml;
    
            // Optionally, you could implement code to show a modal or change the layout as needed
        }
    });
}
