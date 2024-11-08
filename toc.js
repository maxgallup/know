// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Knowledge Base</a></li><li class="chapter-item expanded "><a href="SoftwareTesting/index.html"><strong aria-hidden="true">2.</strong> Software Testing</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="SoftwareTesting/srs.html"><strong aria-hidden="true">2.1.</strong> Software Requirements Specification</a></li><li class="chapter-item expanded "><a href="SoftwareTesting/white-box.html"><strong aria-hidden="true">2.2.</strong> White Box Testing</a></li><li class="chapter-item expanded "><a href="SoftwareTesting/black-box.html"><strong aria-hidden="true">2.3.</strong> Black Box Testing</a></li><li class="chapter-item expanded "><a href="SoftwareTesting/techniques.html"><strong aria-hidden="true">2.4.</strong> Techniques</a></li></ol></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/index.html"><strong aria-hidden="true">3.</strong> Advanced Operating Systems</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/booting.html"><strong aria-hidden="true">3.1.</strong> Booting</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/memory.html"><strong aria-hidden="true">3.2.</strong> Memory</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/page-tables.html"><strong aria-hidden="true">3.3.</strong> Page Tables</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/user-mode.html"><strong aria-hidden="true">3.4.</strong> User Mode</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/interrupts.html"><strong aria-hidden="true">3.5.</strong> Interrupts</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/system-calls.html"><strong aria-hidden="true">3.6.</strong> System Calls</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/paging.html"><strong aria-hidden="true">3.7.</strong> Paging</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/multiprocessing.html"><strong aria-hidden="true">3.8.</strong> Multi-Processing</a></li><li class="chapter-item expanded "><a href="AdvancedOperatingSystems/multicore.html"><strong aria-hidden="true">3.9.</strong> Multi-Core</a></li></ol></li><li class="chapter-item expanded "><a href="HardwareSecurity/index.html"><strong aria-hidden="true">4.</strong> Hardware Security</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="HardwareSecurity/dram.html"><strong aria-hidden="true">4.1.</strong> DRAM</a></li></ol></li><li class="chapter-item expanded "><a href="PerformanceOfNetworkedSystems/index.html"><strong aria-hidden="true">5.</strong> Performance Of Networked Systems</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
