export default function initScroll(item) {
    // Check if jScrollPane is attached
    let scrollData = item.data('jsp');
    if(typeof scrollData !== 'undefined') {
        scrollData.reinitialise();
    } else {
        item = item.jScrollPane({
            autoReinitialise: true
        });
    }
}