/**
 * Created with JetBrains WebStorm.
 * User: nsaini
 * Date: 9/9/13
 * Time: 3:01 PM
 * To change this template use File | Settings | File Templates.
 */
var clientConfig = {
    APP_VERSION: 'v220',
    /* NSI : 9/10/13 11:29 AM -- LIVE_SERVICE_URL is used for fetch the data, when project is running on live server*/
    //LIVE_SERVICE_URL:"http://iomservice09.io-virtualvenue.com/getjson.aspx?venueConfiguration=1&db=msg013-001-prod",
    LIVE_SERVICE_URL: '//iomvvservice001.io-virtualvenue.com/',
    /* NSI : 9/10/13 11:29 AM --- PRODUCTION_SERVICE_URL is used for fetch the data, when project is running on dev server*/
    //PRODUCTION_SERVICE_URL:"http://iomservice08.io-virtualvenue.com/getjson.aspx?venueConfiguration=1&db=msg013-001-dev",
    PRODUCTION_SERVICE_URL: '//iomvvserviceuat001.io-virtualvenue.com/',
    /* NSI : 12/11/14 2:59 PM --- Service Request header*/
    SERVICE_REQUEST_HEADER: 'lac001',
    /* NSI : 9/10/13 11:29 AM --- LOCAL_SERVICE_URL contains service data JSON File locally application used to fetch service data from this file when running on live*/
    LOCAL_SERVICE_URL: 'confignew.json',
    /* NSI : 9/10/13 11:29 AM --- GET_LOCAL_SERVICE_DATA should be true if application have to fetch data from local JSON File instead of webservice. On dev server data will always be fetched from PRODUCTION_SERVICE_URL irrespective of GET_LOCAL_SERVICE_DATA flag value
    * if live URL used for VV, fetch data JSON file from local confignew json file,
    * in case of live server, if local confignew json file is not available or showing up error then fetch data json from web services
    * if server is production fetch data JSON from the webservices*/
    GET_LOCAL_SERVICE_DATA: true,
    /******************************************Client Config ******************************************/
    /* NSI : 9/10/13 2:26 PM --- VENUE_NAME used to show name of venue on loading screen*/
    VENUE_NAME: 'Chargers SoFi Stadium',
    /* NSI : 1/14/13 4:13 PM --- VENUE_PAGE_TITLE is used to show page title in case IE browser*/
    VENUE_PAGE_TITLE: 'Chargers SoFi Stadium Virtual Venue™ by IOMEDIA',
    /* NSI : 9/10/13 2:27 PM --- APP_BASE_URL has been used for social networking and sharing*/
    APP_BASE_URL: '//chargers.io-media.com',
    /* NSI : 9/10/13 2:28 PM --- copyrightLink url used in application footer */
    copyrightLink: 'http://www.io-media.com',
    /* NSI : 9/10/13 2:29 PM --- CHAT_URL used for client chat feature*/
    CHAT_URL: 'https://cloud.la.chargers.com/chat',
    /* NSI : 9/10/13 2:30 PM --- CAMERA_INITIAL_FOV, CAMERA_ZOOM_ENABLED both these remains constant & has been used for pano view*/
    CAMERA_INITIAL_FOV: 65,
    CAMERA_ZOOM_ENABLED: false,
    /************************************************END**********************************************/
    /* NSI : 9/10/13 11:43 AM --- navigator menu day view title*/
    DAY_VIEW_TITLE: 'Day View',
    /* NSI : 9/10/13 11:43 AM --- navigator menu night view title*/
    NIGHT_VIEW_TITLE: 'Night View',
    /* NSI : 10/1/13 11:45 AM --- chat button title*/
    CHAT_BUTTON_TITLE: 'Chat',
    /* NSI : 10/9/13 4:23 PM --- if price list count is greater than PRICE_LIST_BLOCK_COUNT constant value than price list will be break down into rows.
     each row contains price list block = PRICE_LIST_BLOCK_COUNT, by default it should be set to '4'. Price list count less than or equal to this value the block auto adjusted */
    PRICE_LIST_BLOCK_COUNT: 4,
    /* NSI : 10/17/13 12:55 PM --- footer NOTE */
    FOOTER_NOTE: '',
    /* NSI : 10/30/13 5:32 PM --- disclaimer(Title) link show stadium disclaimer content like NYY, this link visible on loading screen*/
    DISCLAIMER_TITLE: '',
    DISCLAIMER_CONTENT: '',
    /* NSI : 11/21/13 5:43 PM --- search box default HELP text*/
    SEARCH_HELP_TEXT: '',
    /* NSI : 5/2/14 10:51 AM --- addthis sharing description*/
    SHARING_DESCRIPTION: '',
    ELEMENT_FOR_POWERTOOL_1_WIDTH: '125px',
    ELEMENT_FOR_POWERTOOL_2_WIDTH: '176px',
    ELEMENT_FOR_POWERTOOL_1_IPAD_WIDTH: '118px',
    ELEMENT_FOR_POWERTOOL_2_IPAD_WIDTH: '163px',
    /* NSI : 12/15/14 2:42 PM --- application service error codes with messages*/
    SERVICE_ERROR_CODES: {
        1001: 'FATAL_EXCEPTION',
        1002: 'OTHER_ERROR',
        1003: 'INSUFFICIENT_PARAMETER',
        1004: 'INVALID_VENUE_Configuration_Id',
        1005: 'INVALID_REQUEST',
        1006: 'INVALID_PARAMETER',
        1007: 'DUPLICATE_PARAMETER',
        1008: 'TYPE_MISMATCH',
        1009: 'INVALID_PARAMETER_VALUE',
        1010: 'INVALID_Command',
        1011: 'INVALID_HEADER',
        1012: 'INVALID_JSON',
        1013: 'INVALID_SERVICE_TYPE',
        1014: 'INVALID_DATABASE',
        1015: 'INVALID_COMMAND_NAME'
    },
    /* PKI : 21/04/15 11:33 AM --- Desktop tour SVG co-ordinates*/
    /*SVG Line 1 co-ordinates*/
    TOUR_FIRST_VIEW_X1_AXIS: 3,
    TOUR_FIRST_VIEW_Y1_AXIS: 158,
    TOUR_FIRST_VIEW_X2_AXIS: 129,
    TOUR_FIRST_VIEW_Y2_AXIS: 0,
    /*SVG Line 2 co-ordinates*/
    TOUR_SECOND_VIEW_X1_AXIS: 0,
    TOUR_SECOND_VIEW_Y1_AXIS: 43,
    TOUR_SECOND_VIEW_X2_AXIS: 170,
    TOUR_SECOND_VIEW_Y2_AXIS: 54,
    /* PKI : 21/04/15 11:33 AM --- Ipad tour SVG co-ordinates*/
    /*SVG Line 1 co-ordinates*/
    IPAD_TOUR_FIRST_VIEW_X1_AXIS: 0,
    IPAD_TOUR_FIRST_VIEW_Y1_AXIS: 242,
    IPAD_TOUR_FIRST_VIEW_X2_AXIS: 122,
    IPAD_TOUR_FIRST_VIEW_Y2_AXIS: 4,
    /*SVG Line 2 co-ordinates*/
    IPAD_TOUR_SECOND_VIEW_X1_AXIS: 3,
    IPAD_TOUR_SECOND_VIEW_Y1_AXIS: 66,
    IPAD_TOUR_SECOND_VIEW_X2_AXIS: 300,
    IPAD_TOUR_SECOND_VIEW_Y2_AXIS: -60,

    /* NSI : 9/26/13 3:12 PM */
    PRICE_NOTE: '*Price Includes: GST on Season + PL ent tax on season + pl, fac fee on season'
};
