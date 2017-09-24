/**
 * Takoyaki Clusters Page Component
 * =================================
 *
 * Page exposing the harmonization interface.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {format} from 'd3-format';
import cls from 'classnames';

import {AutoSizer, List} from 'react-virtualized';
import ClusterInformation from './ClusterInformation';
import Button from '../../Button';
import AffixTitle from '../../AffixTitle';
import {InlineRecipeSelect} from '../../selectors';
import {Level, LevelLeft, LevelRight, LevelItem} from '../../levels';
import Waiter from '../../Waiter';

import {actions as mainActions, selectors as mainSelectors} from '../../../modules/main';

/**
 * Formats.
 */
const NUMBER_FORMAT = format(',');

/**
 * Connection to store.
 */
const connectToStore = connect(
  state => {
    return {
      main: state.main,
      availableRecipes: state.recipes.recipes,
      recipe: mainSelectors.clusteredRecipeData(state),
      nextRecipe: mainSelectors.nextRecipeData(state)
    };
  },
  dispatch => {
    return {
      actions: bindActionCreators(mainActions, dispatch)
    };
  }
);

/**
 * Main component.
 */
class ClustersPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.runNextRecipe = this.runNextRecipe.bind(this);
    this.runSelectedRecipe = this.runSelectedRecipe.bind(this);
  }

  runNextRecipe() {
    const {
      actions,
      nextRecipe
    } = this.props;

    actions.selectRecipe(nextRecipe.id);
    actions.runRecipe();
  }

  runSelectedRecipe(option) {
    const {
      actions,
      recipe,
    } = this.props;

    if (option.value === recipe.id)
      return;

    actions.selectRecipe(option.value);
    actions.runRecipe();
  }

  render() {
    const {
      actions,
      main,
      availableRecipes,
      recipe,
      nextRecipe,
      hidden = false
    } = this.props;

    let workspace;

    if (main.clustering) {
      workspace = (
        <h2 className="title is-4">
          Finding clusters<Waiter />
        </h2>
      );
    }
    else if (!main.clusters || !main.clusters.size) {
      workspace = (
        <h2 className="title is-4">
          Sorry, no clusters were found :(
        </h2>
      );
    }
    else {

      const inlineRecipeSelector = (
        <InlineRecipeSelect
          recipes={availableRecipes}
          value={recipe.id}
          onChange={this.runSelectedRecipe} />
      );

      workspace = (
        <div style={{height: '100%'}}>
          <AffixTitle affix="1.">
            Check the <span className="highlight">{NUMBER_FORMAT(main.clusters.size)}</span> clusters found
            by the {inlineRecipeSelector} recipe on
            the <span className="highlight">{main.clusteredHeader}</span> column
          </AffixTitle>
          <AutoSizer>
            {({width, height}) => {

              // NOTE: subtracting 60 to get top bar out of the way
              return (
                <List
                  width={width}
                  height={height - 60}
                  rowCount={main.clusters.size}
                  rowHeight={({index}) => {
                    const cluster = main.clusters.get(index);

                    // Estimated height in pixels
                    return 188 + (cluster.groups.length * 24);
                  }}
                  rowRenderer={({index, style}) => {
                    const cluster = main.clusters.get(index);

                    return (
                      <div key={cluster.key} style={style}>
                        <ClusterInformation
                          key={index}
                          index={index}
                          cluster={cluster}
                          explore={actions.explore}
                          updateHarmonizedValue={actions.updateHarmonizedValue}
                          harmonizeCluster={actions.harmonizeCluster}
                          dropCluster={actions.dropCluster}
                          removeValueFromCluster={actions.removeValueFromCluster} />
                      </div>
                    );
                  }} />
              );
            }}
          </AutoSizer>
        </div>
      );
    }

    return (
      <div className={cls('full-height', hidden && 'hidden')}>
        <section className="workspace">
          {workspace}
        </section>
        <Level className="action-bar">
          <LevelLeft>
            <LevelItem>
              <Button
                outlined
                onClick={() => actions.changeStep('main')}>
                Back
              </Button>
            </LevelItem>
          </LevelLeft>
          <LevelRight>
            <LevelItem>
              <Button
                loading={main.clustering}
                onClick={actions.runRecipe}>
                Re-cluster
              </Button>
            </LevelItem>
            <LevelItem>
              {nextRecipe ?
                (
                  <Button
                    onClick={this.runNextRecipe}>
                    Next recipe: "<em>{nextRecipe.label}</em>"
                  </Button>
                ) :
                (
                  <Button disabled>
                    No next recipe
                  </Button>
                )
              }
            </LevelItem>
          </LevelRight>
        </Level>
      </div>
    );
  }
}

export default connectToStore(ClustersPage);
