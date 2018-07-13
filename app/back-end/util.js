export const ncUser         = process.env.NC_USER;
export const ncPass         = process.env.NC_PASS;
export const softwareVersion     = process.env.VERSION;
export const emailContact        = process.env.CONTACT;
export const emailContactCommand = "mailto:"+emailContact+"?subject=SFB833 - Jack the SIPper";
export const fileStorageServer   = '/nextcloud/';

export function rewriteURL( fileURL ) {
    var href = window.location.origin.concat(window.location.pathname);

    console.log('util/rewriteURL at start', fileURL, href);

    var corsLink = "";
    if ( fileURL.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	corsLink = fileURL.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud',
				   'weblicht-sfs-nextcloud').concat('/download');
    }
	
    console.log('util/rewriteURL at end', fileURL, href);
    return href.concat(corsLink);                            
}

