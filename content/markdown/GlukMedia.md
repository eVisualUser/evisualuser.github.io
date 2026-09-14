**Gluk Media** is a company located in **Vilnius, Lithuania**.
I did a **six-month internship**, where my tasks were around producing **kiosk applications for museums**.

It was for me the opportunity to work on projects with destination being real clients. 
And organize myself to fit the deadlines.

Most of the projects did always work by first having a first version with placeholders, to have the client approve the design.
Then, depending on the project, I may already have, or to wait for the complete content.

## Challenges

- Working in another country (Lithuania).
- Long-running applications.
- Android support.
- Deployment.
- Demonstration demo for the client.
- Adapting to new technologies for a project.

## Projects

Projects are in order of completion.

### Video Player

The video player was about displaying a localized video with time codes and smooth playback.
The target device was an Android tablet, and about to be running all day at the museum.

I received the design from the UI/UX designer of the team.
And followed it closely to ensure the final product met the client's expectations.
Note that the client had validated the design and I made sure to implement it accurately.

Application was all about video playing, with also a "main menu" screen, but the core of the user interaction was the video player.
It has chapters as time codes, and the video player had to handle smooth playback and navigation.

#### Challenges

The first challenge was simply about video loading, as we want the user to select a language, click on play, and instantly have the video ready.
It required making sure I can parallel as much as Unity allows to avoid blocking the video loading.

But I rapidly met a hard problem, the video was high quality and avoided heavy compression to keep quality.
Causing to have GPU memory limits.
To address it, I investigated with highly optimized video players such as VLC.
And the result was VLC handling it smoothly, except I had few stalls when moving from time code to another.

So it led me to try using QT Widgets and QT Qml, and the result was exactly the same as with using AVPro inside Unity.
But AVPro had also another issue by itself, the version owned by the company was older than the latest Unity versions,
so I had to do few modifications, while respecting its licensing.

### Common Kiosk Applications

I made two other kiosk apps for the museum, both with unique designs.
One is made with Unity UGUI, and the other with UI Toolkit.

Then information shows up, with a few custom widgets adding
special animations.

Both projects are awaiting clients’ content.

#### Challenges

- Making complex UI widgets. Not trivial for Unity UI, especially when using UGUI, Toolkit was slightly better at it.
- Optimizing the handling of many localized text and images, without overpopulating memory.
- Make it all smooth. No interaction was instantaneous.

### Fullstack Website QR Code-based

This one is special, as I was not a web developer. But I had to adapt to it.
The company is not used to this kind of project, so had a little bit of exploration there.

The idea was, museum wants QR codes, that visitors scans, and lead them to the website relative page.
And by having 12 pages, with in average 3 sections, having on html per page was not too complex.
So I did a backend in Rust using Rocket, to build pages based on templates.

And so all they had todo was doing /get/page_01 to get first page.
I didn't hash pages to allow visitors to easily go back to older pages by using their browser history.

The reason I choose Rust, was for reliability. I know a few languages, C/C++, C#, Python, JavaScript, and finally Rust.
Thing is I never used Node.js, so making a server in js was taking the risk to lose a lot of time, while the deadline was fairly short (3 weeks).
Compared to Rust, where it took me only three days to make it work, surely I did many changes afterward based on my needs.

I heavily exploited async capabilities of Rocket.

One of the requirements was also displaying a 3D model.
So I choose Three.js (rendering) and Hammer.js (inputs).

I did applied compression on web request to reduce loading time.
And reduce the count of unique requests, as by having many request, you creat "fake" loading time,
but asking to wait latency before getting the second part of elements.

But in conclusion, the result was great, performance as required.

#### Challenges

- Make loading of the page in less than 3 seconds even in 3G.
- Prevent loading when displaying 3D models, same for the image gallery.
- Make a backend ready to handle hours of runtime.
