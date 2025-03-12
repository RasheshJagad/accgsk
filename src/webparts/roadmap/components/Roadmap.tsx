import * as React from 'react';
import styles from './Roadmap.module.scss';
import type { IRoadmapProps } from './IRoadmapProps';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { Modal } from '@fluentui/react';
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

const Roadmap: React.FunctionComponent<IRoadmapProps> = (props: IRoadmapProps) => {

  const [roadmapData, setRoadMapData] = React.useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [selectedRoadMap, setSelectedRoadMap] = React.useState<any>();
  const [editorValue, setEditorValue] = React.useState<string>('');
  const [isOwner, setIsOwner] = React.useState<boolean>(false);

  //set model state for open modal popup
  const setModalIsOpenToTrue = (roadmapItem: any) => {
    setModalIsOpen(true);
    setSelectedRoadMap(roadmapItem);
    setEditorValue(roadmapItem.RoadmapDescription);
  }

  //close modal popup
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false)
  }

  //richtext change event
  const onTextChange = (newText: string) => {
    setEditorValue(newText);
    return newText;
  };

  //fetch all roadmaps from SP list
  const fetchRoadMaps = async () => {
    try {
      const sp = spfi().using(SPFx(props.context));
      const items: any[] = await sp.web.lists.getByTitle('Roadmaps')
        .items.select('ID', 'Title', 'RoadmapDescription', 'RoadmapOrder')
        .orderBy('RoadmapOrder', true)();
      setRoadMapData(items);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  //button click to update roadmap
  const UpdateRoadMap = async () => {
    const sp = spfi().using(SPFx(props.context));
    try {
      await sp.web.lists.getByTitle('Roadmaps').items.getById(selectedRoadMap.ID).update({
        RoadmapDescription: editorValue
      }).catch(err => {
        console.error("Error subscribing :", err)
      });
      //alert(`Updated successfully: ${selectedRoadMap.Title}`);
      setEditorValue('');
      setModalIsOpen(false);
      fetchRoadMaps();
    } catch (err) {
      console.error("Error while Updated roadmap:", err)
    }
  };
  const GetCurrentUserGroup = async () => {
    try {
        const OwnersGroupId  = 3
        const sp = spfi().using(SPFx(props.context));
        const groups = await sp.web.currentUser.groups();
        groups.forEach(group => {
          if(group.Id == OwnersGroupId) {
            setIsOwner(true);
          }
      });
      } catch (error) {
        console.error('Error fetching services:', error);
      }
  };
  React.useEffect(() => {
    fetchRoadMaps();
    GetCurrentUserGroup();
  }, [props.context]);

  return (
    <div >
      <div className={styles.landingCenter}>
        <article className={styles.roadMapSec}>
          {/* <h3>{props.roadmapTitle}</h3>
          <div style={{ marginBottom: '20px' }}>{props.roadmapDescription}</div> */}
          <ul className={`row ${styles.roadMapList}`}>
            {roadmapData.map((item: any, i: number) => (
              <li className={`col-xl-3 col-lg-4 col-md-6 mb-4 ${styles.roadMapListItem}`}>
                <div className={styles.roadMapItem}>
                  <div className={
                    (i === 0) ? styles.color1 :
                      (i === 1) ? styles.color2 :
                        (i === 2) ? styles.color3 :
                          (i === 3) ? styles.color4 : styles.color1
                  }>
                    <strong className='ml-3'>{item.Title}</strong>
                    {isOwner && (<span className={`ml-auto mr-2 ${styles.edit}`} onClick={() => setModalIsOpenToTrue(item)}>Edit</span>)}</div>
                  <div className={`${styles.roapmapContent}`} dangerouslySetInnerHTML={{ __html: item.RoadmapDescription }} />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <Modal isOpen={modalIsOpen} onDismiss={() => setModalIsOpen(false)}>
          {selectedRoadMap && (
            <div className={styles.modalContainer}>
              <h2 className={styles.modalHead}>{selectedRoadMap.Title}</h2>
              <div className={styles.richTextContainer}>
                <RichText isEditMode={true} value={editorValue} onChange={onTextChange} />
              </div>
              <div className="text-center">
                <button onClick={UpdateRoadMap} className={styles.submitBtn}>Submit</button>
              </div>
              <button onClick={setModalIsOpenToFalse} className={styles.modalClose} />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
export default Roadmap;