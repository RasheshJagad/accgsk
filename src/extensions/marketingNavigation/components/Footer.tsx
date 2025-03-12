import * as React from 'react';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import styles from './Footer.module.scss';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/presets/all";

export interface IFooterProps {
    context: ApplicationCustomizerContext;
    domElement: HTMLDivElement;
}

const Footer: React.FunctionComponent<IFooterProps> = (props: IFooterProps) => {

    const [rootSiteUrl, setRootSiteUrl] = React.useState<string>('');
    const [navItems, setNavItems] = React.useState<any[]>([]);
    const [isSiteAdmin, setIsSiteAdmin] = React.useState<boolean>(true);

    const loadFooters = async (): Promise<void> => {
        const _sp = spfi(rootSiteUrl).using(SPFx(props.context));
        const menuItems: any[] = await _sp.web.lists.getByTitle('Footers').items.select("Id", "Title", "NavigationURL").orderBy('Id', true)();
        setNavItems(menuItems);
    }

    const getRootSiteUrl = async () => {
        const sp = spfi().using(SPFx(props.context));
        const rootItem = await sp.web.lists.getByTitle('Configurations').items.filter(`Title eq 'RootSiteUrl'`).select('Title,ConfigurationValue')();
        if (rootItem.length > 0) {
            setRootSiteUrl(rootItem[0].ConfigurationValue);
        }
    }
    const checkIfUserIsAdmin = async () => {
        const _sp = spfi().using(SPFx(props.context));
        const currentUser = await _sp.web.currentUser();
        const ownersGroup = await _sp.web.associatedOwnerGroup();
        const ownersGroupUsers = await _sp.web.siteGroups.getById(ownersGroup.Id).users();
        const isInOwnersGroup = ownersGroupUsers.some(u => u.Id === currentUser.Id);
        setIsSiteAdmin(isInOwnersGroup);
    }

    React.useEffect(() => {
        checkIfUserIsAdmin();
        getRootSiteUrl();
    }, []);
    React.useEffect(() => {
        if (rootSiteUrl !== '' && rootSiteUrl !== null && typeof rootSiteUrl !== typeof undefined) {
            loadFooters();
        }
    }, [rootSiteUrl]);

    return (
        <>
            {(rootSiteUrl !== '' && rootSiteUrl !== null && typeof rootSiteUrl !== typeof undefined) &&
                <div className={`${styles.footerWrapper}`}>
                    {isSiteAdmin &&
                        <a href={`${rootSiteUrl}/Lists/Footers`}>Edit</a>
                    }
                    {
                        navItems.map((f: any) => (
                            <a href={(f.NavigationURL !== '' && f.NavigationURL !== null && typeof f.NavigationURL !== typeof undefined) ? `${f.NavigationURL.Url}` : ``}>{f.Title}</a>
                        ))
                    }
                </div>
            }
        </>
    );
}

export default Footer;