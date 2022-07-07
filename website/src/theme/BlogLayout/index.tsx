/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";

import type { Props } from "@theme/BlogLayout";

import styles from "./styles.module.css";

interface PropsExtended extends Props {
  hero: ReactNode;
}

export default function BlogLayout(props: PropsExtended): JSX.Element {
  const { sidebar, toc, children, hero, ...layoutProps } = props;

  return (
    <Layout {...layoutProps}>
      {hero && hero}
      <div className="container margin-vert--lg">
        <div className="row">
          <main
            className={clsx(
              "col",
              toc ? "col--10" : { "col--12": true, [styles.blogLayout]: true }
            )}
            itemScope
            itemType="http://schema.org/Blog"
          >
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
