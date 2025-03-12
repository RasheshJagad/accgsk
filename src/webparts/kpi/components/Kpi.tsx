import * as React from 'react';
import styles from './Kpi.module.scss';
import type { IKpiProps } from './IKpiProps';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

const Kpi:  React.FunctionComponent<IKpiProps> = (props: IKpiProps) => {
  const [cauroselKPIs, setCauroselKPIs] = React.useState<any[]>([]);
  const [cauroselCatagories, setCauroselCatagories] = React.useState<any[]>([]);

  const CustomPrevArrow2 = (prop: any) => {
    const { onClick } = prop;
    return (
      <span className={`${styles.slickArrow2} ${styles.slickPrev2}`} onClick={onClick}>Prev</span>
    )
  };
  
  const CustomNextArrow2 = (prop: any) => {
    const { onClick } = prop;
    return (
      <span className={`${styles.slickArrow2} ${styles.slickNext2}`} onClick={onClick}>Next</span>
    )
  };

  var settings2 = {
    dots: false,
    arrows: true,
    nextArrow: <CustomNextArrow2 />,
    prevArrow: <CustomPrevArrow2 />,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed:5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    fade:true
  };

  React.useEffect(() => { loadCarouselKPIs(); }, []);
  React.useEffect(() => {
    console.log("cauroselKPIs", cauroselKPIs);
    setCauroselCatagories(cauroselKPIs.map(item => item.KPICategory).filter((value, index, self) => self.indexOf(value) === index));
  }, [cauroselKPIs]);

  

  const loadCarouselKPIs = async (): Promise<void> => {
    const sp = spfi().using(SPFx(props.context));
    const cItems = await sp.web.lists.getByTitle('KPIs').items();
    setCauroselKPIs(cItems);
  }

  return (
      <div className={styles.center}>
      <Slider {...settings2}>
        {
          cauroselCatagories.map((c: string) => {
            return (
              <article className={`${styles.carouselItemHolder}`}>
                <div className={`${styles.carouselItem}`}>
                  <strong>{c}</strong>
                  <ul>
                    {
                      cauroselKPIs.filter(k => k.KPICategory === c).map(_ => {
                        return (<li><strong>{_.KPIValue}</strong><span>{_.Title}</span></li>);
                      })
                    }
                  </ul>
                </div>
              </article>
            );
          })
        }
      </Slider>
    </div>
    );
  }

export default Kpi;
