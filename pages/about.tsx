import { Button, Text } from '@vercel/examples-ui'
import OptimizeLayout from '@components/layout'
import { COOKIE_NAME } from '@lib/constants';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { useGa } from '@lib/useGa';

export default function About() {
  const ga = useGa();
  const [exId, setExId] = useState(null);
  const sendEvent = useCallback(() => {
    const event = {
      hitType: "event",
      event_category: "AB Testing",
      event_action: "Clicked button",
      event_label: "AB Testing About button",
      value: "hello!",
    };

    ga("event", "random3", event);

    ga("event", "optimize.callback", {
      callback: (combination, experimentId, containerId) => {
        console.log('variant:', combination, 'experimentId: ', experimentId, 'containerId: ', containerId)
        console.log(`http://optimize.google.com/experiences/${experimentId}?` + `containerId=${containerId}`);
      },
    });

    // ga("event", "optimize.callback", {
    //   callback: (value, name) => {
    //     console.log("Experiment with ID: " + name + " is on variant: " + value)
    //   }
    // });

    console.log("sent event:", event);
  }, []);

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME);
    if (ga && cookie) {
      ga("set", "exp", cookie);
    }
    ga("send", "pageview :-)");
  }, [ga]);
  return (
    <>
      <Text variant="h2" className="mb-6">
        About page
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>/about</b>
      </Text>
      <Text>This is the original about page</Text>
      <Button variant="secondary" onClick={sendEvent}>
        Send event
      </Button>
    </>
  )
}

About.Layout = OptimizeLayout
